import {
    AccountStorageQuery,
    AccountStorageMutation,
    // AccountsQuery,
    // NerdGraphQuery,
    // UserStorageQuery,
    // UserStorageMutation,
    // EntityStorageQuery,
    // EntityStorageMutation,
} from 'nr1';
  
export const getAccountCollection = async ( accountId, collection, documentId ) => {
    const payload = { collection };
    payload.accountId = parseFloat(accountId);
    if (documentId) payload.documentId = documentId;
    const result = await AccountStorageQuery.query(payload);
    console.log(">>> in getAccountCollection() >>> result: ", result);
    const collectionResult = (result || {}).data || (documentId ? null : []);
    return collectionResult;
};

export const writeAccountDocument = async ( accountId, collection, documentId, payload ) => {
    const result = await AccountStorageMutation.mutate({
        accountId,
        actionType: AccountStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
        collection,
        documentId,
        document: payload
    });
    console.log(">>> in writeAccountDocument() >>> result: ", result);
    return result;
};

export const getDate = () => {
    var d = new Date();
    return (
      d.getUTCFullYear() +
      '/' +
      ('0' + (d.getUTCMonth() + 1)).slice(-2) +
      '/' +
      ('0' + d.getUTCDate()).slice(-2) +
      ' ' +
      ('0' + d.getUTCHours()).slice(-2) +
      ':' +
      ('0' + d.getUTCMinutes()).slice(-2) +
      ':' +
      ('0' + d.getUTCSeconds()).slice(-2)
    );
};

