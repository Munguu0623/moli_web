BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Blogs] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    [slug] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000),
    [category] INT,
    [type] NVARCHAR(1000),
    [authorId] INT NOT NULL,
    [modifiedDate] DATETIME2 NOT NULL,
    [image] VARCHAR(255) NOT NULL,
    [createdDate] DATETIME2 NOT NULL CONSTRAINT [Blogs_createdDate_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Blogs_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Category] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Category_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Menu] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(100),
    [parentMenuId] VARCHAR(100),
    [menuType] VARCHAR(100),
    [menuUrl] NVARCHAR(1000),
    [isVisible] INT,
    [createdDate] DATETIME2,
    [modifiedDate] DATETIME2,
    CONSTRAINT [Menu_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RoleMenu] (
    [id] INT NOT NULL IDENTITY(1,1),
    [roleId] VARCHAR(100) NOT NULL,
    [menuId] VARCHAR(100) NOT NULL,
    [createdDate] DATETIME2 NOT NULL,
    CONSTRAINT [RoleMenu_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(100),
    [password] NVARCHAR(1000) NOT NULL,
    [phoneNumber] NVARCHAR(100),
    [email] NVARCHAR(100),
    [createdDate] DATETIME2 NOT NULL,
    [modifiedDate] DATETIME2,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- AddForeignKey
ALTER TABLE [dbo].[Blogs] ADD CONSTRAINT [Blogs_category_fkey] FOREIGN KEY ([category]) REFERENCES [dbo].[Category]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Blogs] ADD CONSTRAINT [Blogs_authorId_fkey] FOREIGN KEY ([authorId]) REFERENCES [dbo].[Users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
