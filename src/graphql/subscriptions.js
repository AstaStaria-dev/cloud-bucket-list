/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBucketItem = /* GraphQL */ `
  subscription OnCreateBucketItem(
    $filter: ModelSubscriptionBucketItemFilterInput
    $owner: String
  ) {
    onCreateBucketItem(filter: $filter, owner: $owner) {
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
export const onUpdateBucketItem = /* GraphQL */ `
  subscription OnUpdateBucketItem(
    $filter: ModelSubscriptionBucketItemFilterInput
    $owner: String
  ) {
    onUpdateBucketItem(filter: $filter, owner: $owner) {
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
export const onDeleteBucketItem = /* GraphQL */ `
  subscription OnDeleteBucketItem(
    $filter: ModelSubscriptionBucketItemFilterInput
    $owner: String
  ) {
    onDeleteBucketItem(filter: $filter, owner: $owner) {
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
