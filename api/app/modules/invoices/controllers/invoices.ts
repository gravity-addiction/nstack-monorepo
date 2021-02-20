export * from './invoices.info';

/*
CREATE TABLE `invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_one` varchar(128) NOT NULL,
  `sender_two` varchar(128) NOT NULL,
  `sender_three` varchar(128) NOT NULL,
  `sender_four` varchar(128) NOT NULL,
  `sender_five` varchar(128) NOT NULL,
  `receiver_one` varchar(128) NOT NULL,
  `receiver_two` varchar(128) NOT NULL,
  `receiver_three` varchar(128) NOT NULL,
  `receiver_four` varchar(128) NOT NULL,
  `receiver_five` varchar(128) NOT NULL,
  `invoice_date` varchar(64) NOT NULL,
  `invoice_num` varchar(64) NOT NULL,
  `invoice_total` double NOT NULL,
  `slug` varchar(64) NOT NULL,
  `datestamp` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
);

CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice_id` int(11) NOT NULL,
  `qty` double NOT NULL,
  `item_title` varchar(512) NOT NULL,
  `item_desc` text NOT NULL,
  `cost_per` double NOT NULL,
  `cost_total` double NOT NULL,
  `datestamp` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `invoices_id` (`invoices_id`),
  CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoices_id`) REFERENCES `invoices` (`id`)
);
*/
