import { ForkOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Carousel,
  Col,
  Grid,
  Image,
  Layout,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import clone from "just-clone";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../App.css";
import { StratagemCard } from "../Components/StratagemCard";
import { UnitCard } from "../Components/UnitCard";
import { useCardStorage } from "../Hooks/useCardStorage";
import { useFirebase } from "../Hooks/useFirebase";
import logo from "../Images/logo.png";

const { useBreakpoint } = Grid;

export const Shared = () => {
  const { Id } = useParams();
  const navigate = useNavigate();

  const { getCategory, likeCategory } = useFirebase();

  const [historyStorage, setHistoryStorage] = useState({ liked: [] });

  const [sharedStorage, setSharedStorage] = useState();

  const { importCategory } = useCardStorage();

  const screens = useBreakpoint();

  useEffect(() => {
    const localShareStorage = localStorage.getItem("historyStorage");
    if (localShareStorage) {
      setHistoryStorage(JSON.parse(localShareStorage));
    }
  }, []);

  useEffect(() => {
    document.title = `Shared ${
      sharedStorage?.category?.name || ""
    } - Game Datacards`;
  }, [sharedStorage]);

  useEffect(() => {
    localStorage.setItem("historyStorage", JSON.stringify(historyStorage));
  }, [historyStorage]);

  useEffect(() => {
    if (Id) {
      getCategory(Id).then((cat) => {
        setSharedStorage(cat);
      });
    }
  }, [Id, getCategory]);

  return (
    <Layout>
      <Header style={{ paddingLeft: 8 }}>
        <Row style={{ justifyContent: "space-between" }} gutter={0}>
          {screens.sm && (
            <Col>
              <Space size={"large"}>
                <Image preview={false} src={logo} width={50} />
                <Typography.Title
                  level={3}
                  style={{ color: "white", marginBottom: 0, marginTop: "0px" }}
                >
                  Game Datacards
                </Typography.Title>
              </Space>
            </Col>
          )}
          {screens.xs && (
            <Col>
              <Space size={"large"}>
                <Image preview={false} src={logo} width={50} />
                <Typography.Title
                  level={3}
                  style={{ color: "white", marginBottom: 0, marginTop: "0px" }}
                >
                  Game Datacards
                </Typography.Title>
              </Space>
            </Col>
          )}
          {screens.lg && (
            <Col>
              <Typography.Title
                level={3}
                style={{ color: "white", marginBottom: 0, lineHeight: "4rem" }}
              >
                {sharedStorage?.category?.name}
              </Typography.Title>
            </Col>
          )}
          <Col>
            <Space>
              {historyStorage.liked.includes(Id) ? (
                <Badge
                  count={sharedStorage?.likes}
                  offset={[-4, 14]}
                  size="small"
                  color={"blue"}
                  overflowCount={999}
                >
                  <Tooltip title={"You have already liked this set."}>
                    <Button
                      className="button-bar"
                      type="text"
                      size="large"
                      disabled={true}
                      icon={
                        <HeartFilled
                          style={{ color: "#40a9ff", cursor: "cursor" }}
                        />
                      }
                    />
                  </Tooltip>
                </Badge>
              ) : (
                <Badge
                  count={sharedStorage?.likes}
                  offset={[-4, 14]}
                  size="small"
                  color={"blue"}
                  overflowCount={999}
                >
                  <Button
                    className="button-bar"
                    type="ghost"
                    size="large"
                    icon={<HeartOutlined />}
                    onClick={() => {
                      const newStorage = clone(historyStorage);
                      newStorage.liked.push(Id);
                      setHistoryStorage(newStorage);
                      setSharedStorage((prev) => {
                        return { ...prev, likes: prev.likes + 1 };
                      });
                      likeCategory(Id);
                    }}
                  />
                </Badge>
              )}
              {screens.lg && (
                <Button
                  className="button-bar"
                  type="ghost"
                  size="large"
                  icon={<ForkOutlined />}
                  onClick={() => {
                    const cloneCategory = {
                      ...sharedStorage.category,
                      name: `Imported ${sharedStorage.category.name}`,
                      uuid: uuidv4(),
                      cards: sharedStorage.category.cards.map((card) => {
                        return { ...card, uuid: uuidv4() };
                      }),
                    };

                    importCategory(cloneCategory);
                    navigate("/");
                  }}
                >
                  Clone
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Header>
      <Content style={{ minHeight: "calc(100vh - 64px)" }} className="data-40k">
        {!screens.xs && (
          <Row>
            {sharedStorage?.category?.cards?.map((card, index) => {
              return (
                <Col
                  span={8}
                  lg={8}
                  md={12}
                  sm={12}
                  xs={24}
                  key={`${card.name}-${index}`}
                >
                  {card.cardType === "datasheet" && <UnitCard unit={card} />}
                  {card.cardType === "stratagem" && (
                    <StratagemCard stratagem={card} />
                  )}
                </Col>
              );
            })}
          </Row>
        )}
        {screens.xs && (
          <Carousel dots={{ className: "dots" }}>
            {sharedStorage?.category?.cards?.map((card, index) => {
              return (
                <>
                  {card.cardType === "datasheet" && (
                    <UnitCard
                      unit={card}
                      key={`${card.name}-${index}`}
                      style={{ display: "flex !important", color: "pink" }}
                    />
                  )}
                  {card.cardType === "stratagem" && (
                    <StratagemCard
                      stratagem={card}
                      key={`${card.name}-${index}`}
                      style={{ display: "flex !important" }}
                    />
                  )}
                </>
              );
            })}
          </Carousel>
        )}
      </Content>
    </Layout>
  );
};