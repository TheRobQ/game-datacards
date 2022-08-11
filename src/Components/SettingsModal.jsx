import { SettingOutlined } from "@ant-design/icons";
import { Button, Card, Col, Collapse, Modal, Popconfirm, Row, Space, Switch, Tabs, Tooltip, Typography } from "antd";
import React from "react";
import { useDataSourceStorage } from "../Hooks/useDataSourceStorage";
import { useSettingsStorage } from "../Hooks/useSettingsStorage";
import { ChangeLog } from "./ChangeLog";

const { Panel } = Collapse;
const { TabPane } = Tabs;

export const SettingsModal = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const { settings, updateSettings } = useSettingsStorage();
  const { dataSource, checkForUpdate, clearData } = useDataSourceStorage();

  const [checkingForUpdate, setCheckingForUpdate] = React.useState(false);

  const refreshData = () => {
    setCheckingForUpdate(true);
    checkForUpdate().then(() => setCheckingForUpdate(false));
  };

  return (
    <>
      <Modal
        title={
          <Row justify="space-between">
            <Col>
              <Typography.Text>Configuration</Typography.Text>
            </Col>
            <Col pull={1}>
              <Typography.Text type="secondary">Version {process.env.REACT_APP_VERSION}</Typography.Text>
            </Col>
          </Row>
        }
        width={"850px"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}
        footer={
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setIsModalVisible(false);
              }}>
              Close
            </Button>
          </Space>
        }>
        <Tabs tabPosition="left">
          {/* <TabPane tab='Preferences' key='1'>
            Content of Tab 1
          </TabPane> */}
          <TabPane tab="Datasources" key="2">
            <Row>
              <Col>
                Please select your prefered game and datasource system. If no system is selected it will default to the
                Basic Card system.
              </Col>
            </Row>
            <Row style={{ paddingTop: "8px" }}>
              <Col span={23}>
                <Card
                  type={"inner"}
                  size={"small"}
                  title={"Basic Cards"}
                  bodyStyle={{ padding: 0 }}
                  style={{ marginBottom: "16px" }}
                  extra={
                    <Switch
                      onChange={() =>
                        updateSettings({
                          ...settings,
                          selectedDataSource: "basic",
                          selectedFactionIndex: 0,
                        })
                      }
                      disabled={settings.selectedDataSource === "basic"}
                      checked={settings.selectedDataSource === "basic"}
                    />
                  }></Card>
              </Col>
              <Col span={23}>
                <Card
                  type={"inner"}
                  size={"small"}
                  title={"Wahapedia data import"}
                  bodyStyle={{
                    padding: settings.selectedDataSource === "40k" ? 8 : 0,
                  }}
                  style={{ marginBottom: "16px" }}
                  extra={
                    <Switch
                      onChange={() =>
                        updateSettings({
                          ...settings,
                          selectedDataSource: "40k",
                        })
                      }
                      disabled={settings.selectedDataSource === "40k"}
                      checked={settings.selectedDataSource === "40k"}
                    />
                  }>
                  {settings.selectedDataSource === "40k" && (
                    <>
                      <Row>
                        <Col span={7} style={{ textAlign: "right" }}>
                          <Typography.Text strong={true}>Checked for update:</Typography.Text>
                        </Col>
                        <Col span={14} push={1}>
                          <Typography>{dataSource.lastCheckedForUpdate}</Typography>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={7} style={{ textAlign: "right" }}>
                          <Typography.Text strong={true}>Data snapshot:</Typography.Text>
                        </Col>
                        <Col span={14} push={1}>
                          <Typography>{dataSource.lastUpdated}</Typography>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={7} style={{ textAlign: "right" }}>
                          <Typography.Text strong={true}>Version:</Typography.Text>
                        </Col>
                        <Col span={14} push={1}>
                          <Typography>{dataSource.version}</Typography>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={7} style={{ textAlign: "right" }}>
                          <Typography.Text strong={true}>Number of factions:</Typography.Text>
                        </Col>
                        <Col span={14} push={1}>
                          <Typography>{dataSource.data.length || 0}</Typography>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={7} style={{ textAlign: "right" }}>
                          <Typography.Text strong={true}>Data store method:</Typography.Text>
                        </Col>
                        <Col span={14} push={1}>
                          <Typography>Locally on IndexDB</Typography>
                        </Col>
                      </Row>
                      <Row style={{ paddingTop: 16 }} justify="center">
                        <Col span={4}>
                          <Button type="default" loading={checkingForUpdate} onClick={refreshData}>
                            Check for update
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </Card>
              </Col>
              <Col span={23}>
                <Card
                  type={"inner"}
                  size={"small"}
                  title={"Necromunda"}
                  bodyStyle={{ padding: 0 }}
                  style={{ marginBottom: "16px" }}
                  extra={
                    <Switch
                      onChange={() =>
                        updateSettings({
                          ...settings,
                          selectedDataSource: "necromunda",
                          selectedFactionIndex: 0,
                        })
                      }
                      disabled={settings.selectedDataSource === "necromunda"}
                      checked={settings.selectedDataSource === "necromunda"}
                    />
                  }></Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Storage" key="3">
            <Row>
              <Col>
                If you would like to clear the local storage please use the button below. Please be noted that this is a
                one way operation and will remove all stored data including saved cards.
              </Col>
            </Row>
            <Row style={{ paddingTop: "16px" }}>
              <Col span={4}>
                <Popconfirm title={"Are you sure you want to remove all data?"} onConfirm={clearData}>
                  <Button danger type="primary" loading={checkingForUpdate}>
                    Clear data
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Changelog" key="4">
            <Row>
              <Col span={23}>
                <ChangeLog />
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Modal>
      <Tooltip title={`Configuration`} placement="bottomLeft">
        {/* <Badge dot style={{ color: "#f5222d", width: "12px", height: "12px" }}> */}
        <Button
          type={"ghost"}
          icon={<SettingOutlined />}
          style={{ color: "white", fontSize: "16px" }}
          size={"large"}
          onClick={() => {
            setIsModalVisible(true);
          }}
        />
        {/* </Badge> */}
      </Tooltip>
    </>
  );
};
