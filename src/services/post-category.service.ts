import {
  IPostCategoryCreate,
  IPostCategoryUpdate,
  IPostCategorySearch
} from 'src/interfaces';
import { APIRequest } from './api-request';

export class PostCategoryService extends APIRequest {
  create(payload: IPostCategoryCreate) {
    return this.post('/post-categories', payload);
  }

  search(query: IPostCategorySearch) {
    return this.get(
      this.buildUrl('/post-categories', query as any)
    );
  }

  findById(id: string) {
    return this.get(`/post-categories/${id}`);
  }

  update(id: string, payload: IPostCategoryUpdate) {
    return this.put(`/post-categories/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/post-categories/${id}`);
  }
}

export const postCategoryService = new PostCategoryService();
