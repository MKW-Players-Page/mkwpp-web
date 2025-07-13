import { apiFetch } from "..";
import { buildQueryParamString } from "../../utils/SearchParams";

export class BlogPost {
  readonly id: number;
  readonly title: string;
  readonly content: string;
  readonly isPublished: boolean;
  readonly publishedAt: number;
  readonly authorId?: number;
  readonly username?: string;

  constructor(
    id: number,
    title: string,
    content: string,
    isPublished: boolean,
    publishedAt: number,
    authorId?: number,
    username?: string,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.isPublished = isPublished;
    this.publishedAt = publishedAt;
    this.authorId = authorId;
    this.username = username;
  }

  public static async getList(limit: number): Promise<Array<BlogPost>> {
    return apiFetch(`/custom/blog/list${buildQueryParamString({ lim: limit })}`);
  }

  public static async getById(id: number): Promise<BlogPost> {
    return apiFetch(`/custom/blog/id/${id}`);
  }
}
