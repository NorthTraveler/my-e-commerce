CREATE TABLE `orderProduct` (
	`id` varchar(255) NOT NULL,
	`quantity` int NOT NULL,
	`productVariantID` int NOT NULL,
	`userID` int,
	`orderID` varchar(255) NOT NULL,
	CONSTRAINT `orderProduct_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(255) NOT NULL,
	`userID` varchar(255),
	`total` real NOT NULL,
	`status` text NOT NULL,
	`created` timestamp DEFAULT (now()),
	`receiptURL` text,
	`paymentIntentID` text,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `review` (
	`id` varchar(255) NOT NULL,
	`rating` real NOT NULL,
	`userID` varchar(255) NOT NULL,
	`productID` int NOT NULL,
	`comment` text NOT NULL,
	`created` timestamp DEFAULT (now()),
	CONSTRAINT `review_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `orderProduct` ADD CONSTRAINT `orderProduct_productVariantID_productVariants_id_fk` FOREIGN KEY (`productVariantID`) REFERENCES `productVariants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orderProduct` ADD CONSTRAINT `orderProduct_userID_products_id_fk` FOREIGN KEY (`userID`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orderProduct` ADD CONSTRAINT `orderProduct_orderID_orders_id_fk` FOREIGN KEY (`orderID`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_userID_user_id_fk` FOREIGN KEY (`userID`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_userID_user_id_fk` FOREIGN KEY (`userID`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `review` ADD CONSTRAINT `review_productID_products_id_fk` FOREIGN KEY (`productID`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `productIdx` ON `review` (`productID`);--> statement-breakpoint
CREATE INDEX `userIdx` ON `review` (`userID`);