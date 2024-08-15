---
title: 'Nest.js Typrorm 多对多关系如何创建'
date: '2023-04-11'
tags: ['Nest.js',]
draft: false
summary: 'Nest.js Typrorm 多对多关系如何创建'
images: ['/static/images/blog/202304/Nest_Typrorm_many_to_many/note.jpg']
authors: ['default']
---

import UnsplashPhotoInfo from './UnsplashPhotoInfo.tsx'

![thumbnail-image](/static/images/blog/202304/Nest_Typrorm_many_to_many/note.jpg)

<UnsplashPhotoInfo photoURL="https://unsplash.com/photos/S3JdHNXSfnA" author="Will H McMahan" />


使用 Typeorm 创建多对多关系的时候，可按以下方法进行。

以 Article 和 Tag 的关系为例：

```tsx
@Entity()
export class Article extends CommonEntity {
    // ...

    // 标签
    @ManyToMany(() => Tag, (tag) => tag.articles)
    @JoinTable()
    tags: Tag[];
}
```

```tsx
@Entity()
export class Tag extends CommonEntity {
    // 标签名
    @Column()
    @IsNotEmpty()
    label: string;

    // 使用的文章
    @ManyToMany(() => Article, (article) => article.tags)
    articles: Article[];
}
```

```tsx
@Module({
    imports: [TypeOrmModule.forFeature([Tag])],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService],
})
export class TagModule {}
```

```tsx
@Module({
    imports: [TypeOrmModule.forFeature([Article]), TagModule],
    controllers: [ArticleController],
    providers: [ArticleService],
})
export class ArticleModule {}
```

在 article.service.ts 中调用 Tag.Service.ts 中的方法：

```tsx
@Injectable()
export class ArticleService {
    list: any[];
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
        private readonly tagService: TagService,
    ) {}

		/**
     * 创建文章
     * @param articleCreateDto
     * @returns
     */
    async create(articleCreateDto: ArticleCreateDto) {

        // ...

				// 在此处就可以使用 this.tagService 来调用 Tag.service 中的方法了
        const tags = await this.tagService.findByIds(ids);
        console.log('所有 tag id：',ids, '文章中的tags',tags);

	      // ...

    }
}
```

**⚠️ 注意：**

- 在 article.service 中调用 tag.service 中的方法的时候要先在 article.module 中 imports 导入 TagModule 模块。
- 还需要在 tag.module 中 exports TagService，否则报以下错。
    
    ```tsx
    Nest can't resolve dependencies of the ArticleService (ArticleRepository, ?). Please make sure that the argument TagService at index [1] is available in the ArticleModule context.
    
    Potential solutions:
    - Is ArticleModule a valid NestJS module?
    - If TagService is a provider, is it part of the current ArticleModule?
    - If TagService is exported from a separate @Module, is that module imported within ArticleModule?
      @Module({
        imports: [ /* the Module containing TagService */ ]
      })
    ```
    

我一开始以为像普通 js 一样直接在 article.service 中导入就可以使用 tag.service 中的方法，导致一直报错，后来发现需要在 article.module 中导入 TagModule 模块才可以。

后来导入之后还是报错，就是上边这个错⬆️，最后才发现要先导出 tag.module 中先导出 TagService 才可以。

angular 的思想和普通 js 差别好大啊 😂 …