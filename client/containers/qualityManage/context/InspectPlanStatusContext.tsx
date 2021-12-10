import { createContext, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
interface InspectPlanStatusContextI {
  createdSubjectDialog: string;
  setCreatedSubjectDialog: Function;
  editSubjectDialog: { _id: string };
  setEditSubjectDialog: Function;
  openDeletePlanDialog: string;
  setOpenDeletaPlanDialog: Function;
  openFileViewDialog: string;
  setOpenFileViewDialog: Function;
  openAssigneePopver: Boolean;
  setOpenAssigneePopver: Function;
  rectificationDialog: string;
  setRectificationDialog: Function;
}

const defaultContext: InspectPlanStatusContextI = {
  createdSubjectDialog: '',
  setCreatedSubjectDialog() {},
  editSubjectDialog: { _id: '' },
  setEditSubjectDialog() {},
  openDeletePlanDialog: '',
  setOpenDeletaPlanDialog() {},
  openFileViewDialog: '',
  setOpenFileViewDialog() {},
  openAssigneePopver: false,
  setOpenAssigneePopver() {},
  rectificationDialog: '',
  setRectificationDialog() {},
};

export const InspectPlanStatusContext = createContext<
  InspectPlanStatusContextI
>(defaultContext);

export const InspectPlanStatusContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [createdSubjectDialog, setCreatedSubjectDialog] = useState(
    defaultContext.createdSubjectDialog
  );
  const [editSubjectDialog, setEditSubjectDialog] = useState(
    defaultContext.editSubjectDialog
  );
  const [openDeletePlanDialog, setOpenDeletaPlanDialog] = useState(
    defaultContext.openDeletePlanDialog
  );
  const [openFileViewDialog, setOpenFileViewDialog] = useState(
    defaultContext.openFileViewDialog
  );
  const [openAssigneePopver, setOpenAssigneePopver] = useState(
    defaultContext.openAssigneePopver
  );

  const [rectificationDialog, setRectificationDialog] = useState(
    defaultContext.rectificationDialog
  );
  const router = useRouter();

  useEffect(() => {
    setCreatedSubjectDialog('');
  }, [router]);

  const providerValue = useMemo(() => {
    return {
      createdSubjectDialog,
      setCreatedSubjectDialog,
      editSubjectDialog,
      setEditSubjectDialog,
      openDeletePlanDialog,
      setOpenDeletaPlanDialog,
      openFileViewDialog,
      setOpenFileViewDialog,
      openAssigneePopver,
      setOpenAssigneePopver,
      rectificationDialog,
      setRectificationDialog,
    };
  }, [
    createdSubjectDialog,
    editSubjectDialog,
    openDeletePlanDialog,
    openFileViewDialog,
    openAssigneePopver,
    rectificationDialog,
  ]);

  return (
    <InspectPlanStatusContext.Provider value={providerValue}>
      {children}
    </InspectPlanStatusContext.Provider>
  );
};

export default InspectPlanStatusContextProvider;
