
import { APIRequest } from './api-request';

class PostService extends APIRequest {
  search(query = {}) {
    return this.get(
      this.buildUrl('/posts/user/search', query)
    ).then((resp) => resp.data);
  }

  details(id) {
    return this.get(
      this.buildUrl(`/posts/${id}`)
    ).then((resp) => resp.data);
  }
}

export const postService = new PostService();
