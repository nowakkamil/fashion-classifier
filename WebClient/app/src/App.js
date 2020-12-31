import './App.css';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function App() {
  return (
    <Upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      listType="picture"
    >
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
}

export default App;
