/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBucketItem = /* GraphQL */ `
  mutation CreateBucketItem(
    $input: CreateBucketItemInput!
    $condition: ModelBucketItemConditionInput
  ) {
    createBucketItem(input: $input, condition: $condition) {
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
export const updateBucketItem = /* GraphQL */ `
  mutation UpdateBucketItem(
    $input: UpdateBucketItemInput!
    $condition: ModelBucketItemConditionInput
  ) {
    updateBucketItem(input: $input, condition: $condition) {
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
export const deleteBucketItem = /* GraphQL */ `
  mutation DeleteBucketItem(
    $input: DeleteBucketItemInput!
    $condition: ModelBucketItemConditionInput
  ) {
    deleteBucketItem(input: $input, condition: $condition) {
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
