import BaseSvc from './BaseSvc';

class InspectQualityFilesSvc extends BaseSvc {
  constructor() {
    super();
    this.apiUrl = '/api/file';
  }

  async upload(files) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    const { data } = await this.api.post('/upload', formData);
    return data;
  }
}

const inspectQualityFilesSvc = new InspectQualityFilesSvc();

export default inspectQualityFilesSvc;
