import { ISearch } from './utils';

export interface IPostCategory {
  _id: string;
  title: string;
  type: string;
  slug: string;
  description: string;
}

export interface IPostCategoryCreate {
  title: string;
  type: string;
  slug: string;
  description: string;
}

export interface IPostCategoryUpdate {
  title: string;
  type: string;
  slug: string;
  description: string;
}

export interface IPostCategorySearch extends ISearch {
  sort: string;
}
