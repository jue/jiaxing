import { createContext, useState, useMemo, useEffect } from 'react';
import { SingletonRouter, useRouter } from 'next/router';
import engineeringSvc from '../../services/EngineeringSvc';
import contractSvc from '../../services/ContractSvc';

interface ProjectContractContextI {
  tabType: number;
  setTabType: Function;

  projectInfos: any;
  setProjectInfos: Function;

  projectInfo: any;
  setProjectInfo: Function;

  contractInfos: any;
  setContractInfos: Function;

  contractInfo: any;
  setContractInfo: Function;

  handleCreateProject: Function;
  handleUpdateProject: Function;
  handleDeleteProject: Function;

  handleCreateContract: Function;
  handleUpdateContract: Function;
  handleDeleteContract: Function;

  query: {
    page: number;
    limit: number;
  };
  count: number;
  setCount: Function;
  setQuery: Function;
}

const defaultContext: ProjectContractContextI = {
  tabType: 0,
  setTabType() {},

  projectInfos: [],
  setProjectInfos() {},

  projectInfo: {},
  setProjectInfo() {},

  contractInfos: [],
  setContractInfos() {},

  contractInfo: {},
  setContractInfo() {},

  handleCreateProject() {},
  handleUpdateProject() {},
  handleDeleteProject() {},

  handleCreateContract() {},
  handleUpdateContract() {},
  handleDeleteContract() {},

  query: {
    page: 0,
    limit: 10,
  },
  setQuery() {},
  count: 0,
  setCount() {},
};

export const ProjectContractContext = createContext<ProjectContractContextI>(
  defaultContext
);

export const ProjectContractContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tabType, setTabType] = useState(defaultContext.tabType);
  const [projectInfos, setProjectInfos] = useState(defaultContext.projectInfos);
  const [projectInfo, setProjectInfo] = useState(defaultContext.projectInfo);

  const [contractInfos, setContractInfos] = useState(
    defaultContext.contractInfos
  );
  const [contractInfo, setContractInfo] = useState(defaultContext.contractInfo);

  const [query, setQuery] = useState(defaultContext.query);
  const [count, setCount] = useState(defaultContext.count);
  const router = useRouter();

  const queryProjects = async () => {
    try {
      const data = await engineeringSvc.search(query);
      setProjectInfos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const queryContracts = async () => {
    try {
      const data = await contractSvc.search({});
      setContractInfos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateProject = async () => {
    try {
      await engineeringSvc.create({ ...projectInfo });
      await queryProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateContract = async () => {
    try {
      await contractSvc.create({ ...contractInfo });
      await queryContracts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProject = async () => {
    try {
      await engineeringSvc.update({ ...projectInfo });
      await queryProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateContract = async () => {
    try {
      await contractSvc.update({ ...contractInfo });
      await queryContracts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProject = async (_id) => {
    try {
      await engineeringSvc.delete(_id);
      await queryProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteContract = async (_id) => {
    try {
      await contractSvc.delete(_id);
      await queryContracts();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (tabType === 0) {
      queryProjects();
    } else {
      queryContracts();
    }
  }, [tabType, query]);

  const providerValue = useMemo(() => {
    return {
      tabType,
      projectInfos,
      setProjectInfos,
      projectInfo,
      setProjectInfo,
      setTabType,

      contractInfos,
      setContractInfos,
      contractInfo,
      setContractInfo,

      handleCreateProject,
      handleUpdateProject,
      handleDeleteProject,

      handleCreateContract,
      handleUpdateContract,
      handleDeleteContract,

      query,
      setQuery,
      count,
      setCount,
    };
  }, [
    query,
    count,
    tabType,
    projectInfos,
    projectInfo,
    contractInfo,
    contractInfos,
  ]);

  return (
    <ProjectContractContext.Provider value={providerValue}>
      {children}
    </ProjectContractContext.Provider>
  );
};

export default ProjectContractContextProvider;

export type PersonnelContextRouter = SingletonRouter & {
  query: { edit: string };
};
