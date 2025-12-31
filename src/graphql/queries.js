/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBucketItem = /* GraphQL */ `
  query GetBucketItem($id: ID!) {
    getBucketItem(id: $id) {
      id
      title
      imageKey
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const listBucketItems = /* GraphQL */ `
  query ListBucketItems(
    $filter: ModelBucketItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBucketItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        imageKey
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
