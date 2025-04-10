CREATE TABLE `localorders` (
	`id` varchar(255) NOT NULL,
	`userID` varchar(255),
	`total` real NOT NULL,
	`status` text NOT NULL,
	`created` timestamp DEFAULT (now()),
	`destination` text NOT NULL,
	`paymentIntentID` text,
	CONSTRAINT `localorders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orderProduct` DROP FOREIGN KEY `orderProduct_orderID_orders_id_fk`;
--> statement-breakpoint
ALTER TABLE `localorders` ADD CONSTRAINT `localorders_userID_user_id_fk` FOREIGN KEY (`userID`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orderProduct` ADD CONSTRAINT `orderProduct_orderID_localorders_id_fk` FOREIGN KEY (`orderID`) REFERENCES `localorders`(`id`) ON DELETE cascade ON UPDATE no action;