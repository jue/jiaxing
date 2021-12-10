import { CompanyModel } from '../../services/mongoose-models/company';
import { DepartmentModel } from '../../services/mongoose-models/department';
import { JobModel } from '../../services/mongoose-models/job';

async function initData() {
  let data = [
    {
      name: '建设单位',
      children: [
        {
          name: '工程管理部',
          children: [
            {
              name: '工程管理组员',
              children: [],
            },
            {
              name: '常务副总',
              children: [],
            },
          ],
        },
        {
          name: '合同管理部',
          children: [
            {
              name: '合同管理组员',
              children: [],
            },
            {
              name: '合同管理部长/组长',
              children: [],
            },
            {
              name: '合同分管领导',
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: '施工单位',
      children: [
        {
          name: '市轨道公司办公室',
          children: [
            {
              name: '经办人-市发改委',
              children: [],
            },
            {
              name: '市轨道公司董事长',
              children: [],
            },
          ],
        },
        {
          name: '业务分管',
          children: [
            {
              name: '业务分管领导',
              children: [],
            },
          ],
        },
        {
          name: '财务管理部',
          children: [
            {
              name: '财务',
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: '监理单位',
      children: [
        {
          name: '监理',
          children: [
            {
              name: '监理员',
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: '设计单位',
      children: [
        {
          name: '设计部',
          children: [
            {
              name: '设计部组长',
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: '设计咨询单位',
      children: [
        {
          name: '设计咨询部',
          children: [
            {
              name: '设计咨询组长',
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: '造价咨询单位',
      children: [
        {
          name: '造价咨询部',
          children: [
            {
              name: '造价咨询部长',
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: '材料设备单位',
      children: [],
    },
    {
      name: '系统设备单位',
      children: [],
    },
    {
      name: '系统软件供应商',
      children: [],
    },
    {
      name: '勘察单位',
      children: [
        {
          name: '勘察部',
          children: [
            {
              name: '勘察员',
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: '咨询单位',
      children: [],
    },
    {
      name: '监测单位',
      children: [],
    },
    {
      name: '检验单位',
      children: [],
    },
    {
      name: '测量单位',
      children: [
        {
          name: '测量部',
          children: [
            {
              name: '测量员',
              children: [],
            },
          ],
        },
      ],
    },
  ];

  data.forEach(async (company) => {
    let companyName = company.name;
    let companyData = await insertCompany(companyName);

    if (companyData) {
      let depts = company.children;

      if (depts.length > 0) {
        depts.forEach(async (dept) => {
          let deptData = await insertDepartment(companyData._id, dept.name);

          if (deptData) {
            let jobs = dept.children;

            if (jobs.length > 0) {
              jobs.forEach(async (job) => {
                await insertJob(
                  deptData.idCompany as string,
                  deptData._id,
                  job.name
                );
              });
            }
          }
        });
      }
    }
  });

  // 创建公司
  async function insertCompany(companyName: string) {
    let company = await CompanyModel.findOne({
      name: companyName,
    });
    if (!company) {
      company = new CompanyModel({
        name: companyName,
        parentId: '0',
        path: '/',
        type: 'system',
      });
      company = await company.save();
    }

    return company;
  }

  // 创建部门
  async function insertDepartment(idCompany: string, deptName: string) {
    let dept = await DepartmentModel.findOne({
      name: deptName,
    });
    if (!dept) {
      dept = new DepartmentModel({
        name: deptName,
        path: '/',
        idCompany: idCompany,
        parentId: '0',
      });
      dept = await dept.save();
    }
    return dept;
  }

  // 创建部门
  async function insertJob(
    idCompany: string,
    idDepartment: string,
    jobName: string
  ) {
    let job = await JobModel.findOne({
      name: jobName,
    });
    if (!job) {
      job = new JobModel({
        path: '/',
        idCompany: idCompany,
        idDepartment: idDepartment,
        name: jobName,
        parentId: '0',
      });
      job = await job.save();
    }
    return job;
  }
}

export default async () => {
  await initData();
};
