CREATE TABLE `productVariants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`color` text NOT NULL,
	`productType` text NOT NULL,
	`updated` timestamp DEFAULT (now()),
	`productID` int NOT NULL,
	CONSTRAINT `productVariants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `VariantImage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` text NOT NULL,
	`size` real NOT NULL,
	`name` text NOT NULL,
	`order` real NOT NULL,
	`variantID` int NOT NULL,
	CONSTRAINT `VariantImage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `VariantTags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tag` text NOT NULL,
	`variantID` int NOT NULL,
	CONSTRAINT `VariantTags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `productVariants` ADD CONSTRAINT `productVariants_productID_products_id_fk` FOREIGN KEY (`productID`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `VariantImage` ADD CONSTRAINT `VariantImage_variantID_productVariants_id_fk` FOREIGN KEY (`variantID`) REFERENCES `productVariants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `VariantTags` ADD CONSTRAINT `VariantTags_variantID_productVariants_id_fk` FOREIGN KEY (`variantID`) REFERENCES `productVariants`(`id`) ON DELETE cascade ON UPDATE no action;