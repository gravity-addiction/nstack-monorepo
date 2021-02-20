import { AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ActionCtrlService, HelperService, PdfkitService, ScreenService } from '@modules/app-common/services/index';
import { ConfigService } from '@modules/app-config/config.service';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, tap } from 'rxjs/operators';

import { CreateInvoiceService, PaymentsService } from '../../services';

declare const SqPaymentForm: any;
declare const window: any;

@Component({
  selector: 'app-payments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payments.component.html',
  styleUrls: ['payments.component.scss'],
})
export class PaymentsComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostListener('window:popstate', ['$event'])
  onPopState(_e: Event) {
    this.payid = null;

    this.squareLoading = true;
    this.paidUp = false;
    this.findingAccount = false;
    this.hasAccount = false;
    this.noAccountFound = false;
    this.findingError = '';

    this.cleanProcessing();
    this.invoiceInfo = null;
    setTimeout(() => { this.PaymentCode.nativeElement.focus(); this.paymentScroll(); }, 100);
  }

  @ViewChild('PaymentCode', { static: false }) PaymentCode!: ElementRef;

  subscriptions: Subscription = new Subscription();
  paymentLookups: Subscription = new Subscription();

  paymentCode = '';
  payid!: string | null;
  amount = 0;
  tenderTotal = 0;
  displayName = '';
  applicationId = '';

  paymentForm!: any;
  squareLoading = true;
  paidUp = false;
  hasCardErrors: string[] = [];
  processingPayment = false;
  processingSuccess = false;
  findingAccount = false;
  findingError = '';
  hasAccount = false;
  noAccountFound = false;

  invoiceInfo!: any;

  constructor(
    public actionCtrl: ActionCtrlService,
    private configService: ConfigService,
    private changeDetectorRef: ChangeDetectorRef,
    private createInvoiceService: CreateInvoiceService,
    private datePipe: DatePipe,
    private helperService: HelperService,
    private location: Location,
    private paymentsService: PaymentsService,
    private pdfkitService: PdfkitService,
    private route: ActivatedRoute,
    private router: Router,
    public screenService: ScreenService
  ) {
    window['cardNonceResponseReceived'] = this.cardNonceResponseReceived.bind(this);

    this.applicationId = (this.configService.config.sqUseSandbox) ? this.configService.config.sqSandbox.app_id : this.configService.config.sqProduction.app_id;
  }

  ngOnInit() {
    this.subscriptions.add(
      this.route.paramMap.pipe(
        switchMap((paramMap: any) => {
          const pay_id = paramMap.get('pay_id') || '';
          if (!pay_id) { return of(null); }
          return this.findPaymentInvoice(pay_id);
        })
      ).subscribe((invoiceInfo: any) => {
        if (invoiceInfo !== null) {
          this.loadInvoice(invoiceInfo);
          this.changeDetectorRef.detectChanges();
        }
      })
    );

    this.subscriptions.add(
      this.screenService.screenChanged.pipe(tap(() => {
        this.screenService.setWidths();
        this.changeDetectorRef.detectChanges();
      })).subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.paymentLookups.unsubscribe();
    try { this.paymentForm.destroy(); } catch (e) { }
  }

  ngAfterViewInit() {
    this.actionCtrl.navLoading = false;
  }

  lookupPayment() {
    if (!this.paymentCode) { return; }

    this.paymentLookups.unsubscribe();
    this.paymentLookups = new Subscription();
    this.paymentLookups.add(
      this.findPaymentInvoice((this.paymentCode || '').trim()).pipe(
        catchError((err: any) => {
          this.findingAccount = false;
          this.findingError = (err.statusText || err.name || 'Server Error') + ', Please refresh and try again.\nIf problem continues please contact gary@strictdevelopment.com.';
          return throwError(err);
        }),
        tap((invoiceInfo: any) => {
          const goodInvoice = this.loadInvoice(invoiceInfo);
          if (goodInvoice && invoiceInfo.hasOwnProperty('slug') && invoiceInfo.slug !== null) {
            // this.router.navigate(['/payments', invoiceInfo.slug], { replaceUrl: true });
            this.location.go("/payments/" + encodeURIComponent(invoiceInfo.slug));
          }
        }),
        finalize(() => {
          this.changeDetectorRef.detectChanges();
        })
      ).subscribe()
    );
  }

  paymentScroll() {
    this.PaymentCode.nativeElement.scrollTo({ behavior: 'smooth' });
  }

  findPaymentInvoice(payid: string) {
    this.findingError = '';
    if (!payid) { return of(null); }
    this.findingAccount = true;

    return this.paymentsService.fetchInvoice(payid);
  }

  getSuccessTenders(): any[] {
    // Check Amounts and Status
    const tenderList = [];
    // console.log('Checking', this.invoiceInfo.payments, this.invoiceInfo.charges);
    // Check Other Payments
    const pLen = this.invoiceInfo.payments.length;
    for (let p = 0; p < pLen; p++) {
      const pInfo = this.invoiceInfo.payments[p] || {};
      if (pInfo.status === 200 || pInfo.status === 201) {
        tenderList.push(pInfo);
      }
    }

    // Calc CC Charges
    const cLen = this.invoiceInfo.charges.length;
    for (let c = 0; c < cLen; c++) {
      const pInfo = this.invoiceInfo.charges[c] || {};
      if (pInfo.status === 200 || pInfo.status === 201) {
        tenderList.push(pInfo);
      }
    }

    return tenderList;
  }

  calcTenderTotal() {
    // Check Amounts and Status
    this.tenderTotal = 0;
    const goodTenders = this.getSuccessTenders();

    const pLen = goodTenders.length;
    for (let p = 0; p < pLen; p++) {
      const pInfo = goodTenders[p] || {};
      this.tenderTotal += pInfo.amount;
    }
  }

  checkPaidUp() {
    if (this.tenderTotal >= Math.round(this.invoiceInfo.invoice_total * 100)) {
      // Payment Found, Paid Up
      this.findingAccount = false;
      this.hasAccount = true;
      this.paidUp = true;
      this.noAccountFound = false;
      return true;
    }
    return false;
  }

  // returns true on valid invoice, false for no invoice
  loadInvoice(invoiceInfo: any): boolean {

    if (invoiceInfo && invoiceInfo.id) {
      this.invoiceInfo = invoiceInfo;
      this.payid = invoiceInfo.slug || '';

      // Calculate Tenders
      this.calcTenderTotal();

      // Invoice Paid Up!
      if (this.checkPaidUp()) { return true; }

      // Invoice Found, Requires Payment
      this.findingAccount = false;
      this.hasAccount = true;
      this.noAccountFound = false;
      this.amount = Math.round(
        Math.round((invoiceInfo.invoice_total || 0) * 100) - this.tenderTotal
      ) / 100;

      if (this.configService.config.sqUseSandbox && !this.helperService.checkScript('squareup')) {
        this.helperService.loadExternalScript('https://js.squareupsandbox.com/v2/paymentform').then(() => {
          this.helperService.scripts['squareup'].loaded = true;
          this.loadPaymentForm();
        }).catch((_err) => { console.log('Error Loading Squareup Sandbox Script', _err); });
      } else {
        this.helperService.loadScript('squareup').then(() => {
          this.loadPaymentForm();
        }).catch((_err) => { console.log('Error Loading Squareup Script', _err); });
      }
      return true;
    } else {
      // No Invoice Found
      this.findingAccount = false;
      this.noAccountFound = true;
      setTimeout(() => { this.PaymentCode.nativeElement.focus(); }, 100);
      return false;
    }
  }

  cleanProcessing() {
    this.hasCardErrors = [];
    this.processingPayment = false;
    this.processingSuccess = false;
  }

  // This function is called when a buyer clicks the Submit button on the webpage
  // to charge their card.
  requestCardNonce(event: Event) {
    if (this.processingPayment) { return; }
    // This prevents the Submit button from submitting its associated form.
    // Instead, clicking the Submit button should tell the SqPaymentForm to generate
    // a card nonce.
    event.preventDefault();

    this.cleanProcessing();
    this.processingPayment = true;
    this.paymentForm.requestCardNonce();
  }

  cardNonceResponseReceived(errors: any[], nonce: string, _cardData: any) {
    // console.log('Received', errors, nonce);
    if (errors) {
      errors.map(e => e.detail = e.message);
      this.hasCardErrors = errors;
      //      console.log('Received', this.hasCardErrors);
      this.processingPayment = false;
    } else {
      this.hasCardErrors = [];

      // Attempt to charge credit card
      this.paymentsService.runPayment(nonce, (this.payid || ''), this.amount).subscribe((result: any) => {
        // console.log('Result', result);

        this.processingPayment = false;
        const status = result.status || '';
        this.invoiceInfo.charges.unshift(result);

        if (status === 200 || status === 201) {
          this.paymentForm.destroy();
          this.processingSuccess = true;
        } else {
          this.hasCardErrors = result.errors || [];
          // console.log('Result', this.hasCardErrors);
        }
        // Calculate Tenders
        this.calcTenderTotal();

        // Invoice Paid Up?
        this.checkPaidUp();

        this.changeDetectorRef.detectChanges();
      }, (err: any) => {
        if (err.status && err.status === 409) {
          // console.log(err.error);
          if (prompt('Rather Pay $' + err.error.amount + '?')) {
            this.amount = err.error.amount;
          }
        }
        this.hasCardErrors = Array.isArray(err.error) ? err.error.map((e: any) => e.detail = e.message) : [{ detail: ((err.error || {}).detail || (err.error || {}).message || err.error) }];

        // console.log('Result Err', this.hasCardErrors);
        this.processingPayment = false;
        this.changeDetectorRef.detectChanges();
      });
    }
  }

  loadPaymentForm() {
    this.paymentForm = new SqPaymentForm({
      applicationId: this.applicationId,
      inputClass: 'sq-input',
      card: {
        elementId: 'sq-card',
        inputStyle: {
          //Set font attributes on card entry fields
          fontSize: '16px',
          fontWeight: 500,
          fontFamily: 'futura',
          placeholderFontWeight: 300,
          autoFillColor: '#DD904A',    //Sets color of card nbr & exp. date
          color: '#DD904A',            //Sets color of CVV & Zip
          placeholderColor: '#DD904A', //Sets placeholder text color
          //Set form appearance
          backgroundColor: '#000',  //Card entry background color
          cardIconColor: '#DD904A', //Card Icon color
          // borderRadius: '50px',
          boxShadow: "0px 2px 6px rgba(0,0,0,.02)," +
            "0px 4px 8px rgba(0,0,0, 0.04), 0px 8px 30px " +
            "rgba(0,0,0, 0.04), 0px 1px 2px rgba(0,0,0, 0.08)",
          //Set form appearance in error state
          error:
          {
            cardIconColor: '#FF3333', //Sets color of card icon
            color: '#FF3333',         //Sets color of card entry text
            backgroundColor: '#000',  //Card entry background color
            fontWeight: 500,
            fontFamily: 'futura'      //Font of the input field in error
          },
          //Set appearance of hint text below form
          details:
          {
            hidden: false,    //Shows or hides hint text
            color: '#DD904A', //Sets hint text color
            fontSize: '12px', //Not inherited from parent, Sets size of
            //text, defaults to 12px
            fontWeight: 500,  //Not inherited from parent
            fontFamily: 'futura', //Not inherited from parent, required to render form
            error:
            { //Sets attributes of hint text in when form
              color: '#FF3333', //is in error state
              fontSize: '12px'
            }
          }
        }
      },
      callbacks: {
        // Called when the SqPaymentForm completes a request to generate a card
        // nonce, even if the request failed because of an error.
        cardNonceResponseReceived: window['cardNonceResponseReceived'],

        unsupportedBrowserDetected: function () {
          // Fill in this callback to alert buyers when their browser is not supported.
          alert('Sorry, your browser is not supported for purchasing.');
        },

        // Fill in these cases to respond to various events that can occur while a
        // buyer is using the payment form.
        inputEventReceived: (inputEvent: any) => {
          switch (inputEvent.eventType) {
            case 'focusClassAdded':
              // Handle as desired
              break;
            case 'focusClassRemoved':
              // Handle as desired
              break;
            case 'errorClassAdded':
              this.processingPayment = false;
              this.changeDetectorRef.detectChanges();
              break;
            case 'errorClassRemoved':
              this.processingPayment = false;
              this.changeDetectorRef.detectChanges();
              break;
            case 'cardBrandChanged':
              // Handle as desired
              break;
            case 'postalCodeChanged':
              // Handle as desired
              break;
          }
        },

        paymentFormLoaded: () => {
          this.squareLoading = false;
          this.changeDetectorRef.detectChanges();
          // Fill in this callback to perform actions after the payment form is
          // done loading (such as setting the postal code field programmatically).
          // this.paymentForm.setPostalCode('94103');
        }
      }
    });
    this.paymentForm.build();
  }


  showInvoice(download = false) {
    this.createInvoiceService.createInvoiceStream(this.invoiceInfo).
      then((doc) => {
        // Add Any more stuff to doc
        if (this.paidUp && this.tenderTotal >= (this.invoiceInfo.invoice_total * 100)) {
          doc.font('Helvetica-Bold').fontSize(18).text('Invoice Paid', 50, 120);
        }

        const goodTenders = this.getSuccessTenders();
        const pLen = goodTenders.length;
        doc.font('Helvetica').fontSize(12);
        doc.y = 140;
        for (let p = 0; p < pLen; p++) {
          const pInfo = goodTenders[p] || {};
          doc.text(this.datePipe.transform(pInfo.datestamp, 'longDate') + ' - $' + (pInfo.amount / 100).toFixed(2) + (pInfo.notes ? ' ' + pInfo.notes : ''), 50, doc.y, { width: 270 }).moveDown(0.20);
        }

        return this.pdfkitService.finishPDF(doc);
      }).
      then((stream: any) => {
        // Outputing BlobStream
        const monYearDate = new Date(this.invoiceInfo.invoice_date);
        const monYear = monYearDate.getFullYear().toString() + '_' + (monYearDate.getMonth() + 1).toString();
        this.pdfkitService.openBlobStream(stream, 'VP-' + monYear + '-' + this.payid, download);
      }).catch(e => { console.log('Loading Libraries,', e); });
  }
}
