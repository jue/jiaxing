import { createContext, useEffect, useState } from 'react';
import { DocumentCategory, Documents } from '../../../typings/document';
import documentCategorySvc from '../../services/DocumentCategorySvc';
import documentSvc from '../../services/DocumentSvc';
import { NewDataStatus } from '../../../constants/enums';
import fileSvc from '../../services/filesSvc';
import companySvc from '../../services/companySvc';
import { WebUpdateMessageI } from '../../../typings/approval_message';
import { defaultContext } from '../contractManage/context/ContractManageContext';

export interface DocumentContextI {
  documentCategorys: DocumentCategory[];

  documentCategory: Partial<DocumentCategory>;
  setDocumentCategory: Function;

  selectCategory: Partial<DocumentCategory>;
  setSelectCategory: Function;

  handleCreateUpdateDocumentCategory: Function;
  handleDeleteDocumentCategory: Function;

  documents: Documents[];

  queryDocument: any;
  setQueryDocument: Function;
  count: number;
  setCount: Function;
  handleUpdateDocument: Function;
  handleDeleteDocument: Function;
  saveFiles: Function;
  companyInfos: any;
  queryCompanys: Function;
  messageInfo: Partial<WebUpdateMessageI>;
  setMessageInfo: Function;
  messageFiles: any;
  setMessageFiles: Function;
  openBackdrop: any;
  setOpenBackDrop: Function;
}

export const DocumentContext = createContext<DocumentContextI>({
  documentCategorys: [],
  documentCategory: {},
  setDocumentCategory() {},

  selectCategory: {},
  setSelectCategory() {},

  handleCreateUpdateDocumentCategory() {},
  handleDeleteDocumentCategory() {},

  documents: [],

  queryDocument: {},
  setQueryDocument() {},
  count: 0,
  setCount() {},
  handleUpdateDocument() {},
  handleDeleteDocument() {},
  saveFiles() {},
  companyInfos: [],
  queryCompanys() {},
  messageInfo: {
    attachments: [],
  },
  setMessageInfo() {},
  messageFiles: [],
  setMessageFiles() {},
  openBackdrop: false,
  setOpenBackDrop() {},
});

const DocumentContextProvider = ({ idParent, children }) => {
  const [openBackdrop, setOpenBackDrop] = useState(false);
  const [messageFiles, setMessageFiles] = useState<any>([]);

  const [documentCategorys, setDocumentCategorys] = useState<
    DocumentCategory[]
  >([]);
  const [documentCategory, setDocumentCategory] = useState<
    Partial<DocumentCategory>
  >({});
  const [selectCategory, setSelectCategory] = useState<
    Partial<DocumentCategory>
  >({});
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [queryDocument, setQueryDocument] = useState({
    limit: 10,
    page: 0,
    search: '',
    dataStatus: NewDataStatus.Normal,
  });
  const [count, setCount] = useState(0);
  const [companyInfos, setCompanyInfos] = useState([]);
  const [messageInfo, setMessageInfo] = useState<Partial<WebUpdateMessageI>>(
    {}
  );
  const queryCompanys = async () => {
    const data = await companySvc.query({});
    setCompanyInfos(data);
  };
  const queryDocumentCategorys = async () => {
    try {
      const data = await documentCategorySvc.query({ idParent });
      await setDocumentCategorys(data);

      if (data.length > 0) {
        await setSelectCategory(data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateUpdateDocumentCategory = async () => {
    try {
      if (!documentCategory._id) {
        await documentCategorySvc.create({
          ...documentCategory,
          idParent,
        });
      } else {
        await documentCategorySvc.update({
          ...documentCategory,
          idParent,
        });
      }

      await setDocumentCategory({});
      await queryDocumentCategorys();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDocumentCategory = async (_id) => {
    try {
      await documentCategorySvc.delete(_id);
      await queryDocumentCategorys();
    } catch (error) {
      console.log(error);
    }
  };

  const queryDocuments = async () => {
    try {
      if (selectCategory._id) {
        const data = await documentSvc.query({
          ...queryDocument,
          idCategory: selectCategory._id,
        });
        setDocuments(data.data);
        setCount(data.count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateDocument = async (updateData) => {
    try {
      await documentSvc.update(updateData);
      await queryDocuments();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteDocument = async (_id) => {
    try {
      await documentSvc.delete(_id);
      await queryDocuments();
    } catch (error) {
      console.log(error);
    }
  };

  const saveFiles = async (files, source) => {
    try {
      for (let file of files) {
        if (file._id) {
          continue;
        }

        let data = await fileSvc.upload([file], '1');
        data && setOpenBackDrop(false);
        let content = data.data[0].resourceName.split('.');
        let contentType = content[content.length - 1];

        source !== 'message' &&
          (await documentSvc.create({
            idCategory: selectCategory._id,
            idFile: data.data[0].resourceId,
            name: data.data[0].resourceName,
            isFavorite: false,
            size: data.data[0].resourceSize,
            dataStatus: NewDataStatus.Normal,
            fileType: contentType,
          }));

        await queryDocuments();
        // await setCount(data.count);
        if (source === 'message') {
          data.data[0].name = selectCategory.name;
          setMessageFiles([...messageFiles, data.data[0]]);
          setMessageInfo({
            ...messageInfo,
            attachments: [...messageInfo.attachments, data.data[0].resourceId],
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    queryDocumentCategorys();
  }, []);

  useEffect(() => {
    queryDocuments();
  }, [selectCategory, queryDocument]);

  return (
    <DocumentContext.Provider
      value={{
        documentCategorys,
        documentCategory,
        setDocumentCategory,
        selectCategory,
        setSelectCategory,
        handleCreateUpdateDocumentCategory,
        handleDeleteDocumentCategory,
        documents,
        queryDocument,
        setQueryDocument,
        handleUpdateDocument,
        handleDeleteDocument,
        saveFiles,
        count,
        setCount,
        companyInfos,
        queryCompanys,
        messageInfo,
        setMessageInfo,
        messageFiles,
        setMessageFiles,
        openBackdrop,
        setOpenBackDrop,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentContextProvider;
