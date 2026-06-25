CREATE TABLE `analyses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`resumeId` int NOT NULL,
	`jobDescription` text NOT NULL,
	`atsScore` int NOT NULL,
	`keywordMatchPercentage` int NOT NULL,
	`matchedKeywords` text NOT NULL,
	`missingKeywords` text NOT NULL,
	`improvementSuggestions` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analyses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resumes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` text NOT NULL,
	`fileUrl` text NOT NULL,
	`fileType` varchar(50) NOT NULL,
	`resumeText` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resumes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `analyses` ADD CONSTRAINT `analyses_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `analyses` ADD CONSTRAINT `analyses_resumeId_resumes_id_fk` FOREIGN KEY (`resumeId`) REFERENCES `resumes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `resumes` ADD CONSTRAINT `resumes_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;