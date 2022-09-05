import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import useMeasure from "react-use-measure";
import { useSelector } from "react-redux";

import SearchModule from "./SearchModule";
import AddModule from "./AddModule";
import NavItem from "./NavItem";
import UploadModal from "./NavModal";
import SearchResult from "./SearchResult";

import "./nav.css";

import HomeSvg from "../../icons/Home.svg";
import MsgSvg from "../../icons/Message.svg";
import SearchSvg from "../../icons/Search.svg";
import SettingSvg from "../../icons/Setting.svg";
import UserSvg from "../../icons/User.svg";
import PlusSvg from "../../icons/Plus.svg";
import NotifySvg from "../../icons/Notification.svg";

function Nav() {
  const [ref, { height }] = useMeasure();
  const [isSearch, setIsSearch] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [msgVisible, setMsgVisible] = useState(false);
  const [modalProps, setModalProps] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const notifCount = useSelector((state) => state.app.notifUnread);
  const msgNav = useSelector((state) => state.app.msgNav);

  function openSearchHandler() {
    setIsSearch(!isSearch);
    if (isSearch) {
      setSearchResult([]);
    }
  }

  function openAddHandler() {
    setIsAdd(!isAdd);
  }

  function openPostHandler() {
    setMsgVisible(true);
    setModalProps("post");
  }

  function openStoryHandler() {
    setMsgVisible(true);
    setModalProps("story");
  }

  function openVideoHandler() {
    setMsgVisible(true);
    setModalProps("video");
  }

  function closeMsgHandler() {
    setMsgVisible(false);
  }

  function searchHandler(value) {
    fetch("https://socialfeedsapp.herokuapp.com/user/search?name=" + value, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.docs) {
          setSearchResult(data.docs);
        } else {
          setSearchResult([]);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <Fragment>
      <UploadModal
        visible={msgVisible}
        onClose={closeMsgHandler}
        type={modalProps}
      />
      <motion.div
        initial={{ y: "50%", scale: 0.7, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1, height }}
        className="nav_btn"
      >
        <div className="nav_con" ref={ref}>
          {isSearch && (
            <motion.div className="search_result">
              {searchResult.map((result) => {
                return (
                  <SearchResult
                    key={result._id}
                    id={result._id}
                    fname={result.fname}
                    lname={result.lname}
                    img={result.img}
                  />
                );
              })}
            </motion.div>
          )}
          {isSearch && (
            <SearchModule
              classProp="nav_search"
              searchHandler={searchHandler}
            />
          )}
          {isAdd && (
            <AddModule
              postHandler={openPostHandler}
              storyHandler={openStoryHandler}
              videoHandler={openVideoHandler}
            />
          )}
          <div>
            <NavItem>
              <NavLink
                className={(navData) => (navData.isActive ? "active" : "")}
                to="/home"
              >
                <img src={HomeSvg} />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={(navData) => (navData.isActive ? "active" : "")}
                to="/message"
              >
                <img src={MsgSvg} />
              </NavLink>
              {msgNav > 0 && (
                <motion.div
                  initial={{ scale: 0.5, y: "50%", opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  className="alert_dot"
                />
              )}
            </NavItem>
            <NavItem>
              <NavLink
                className={(navData) => (navData.isActive ? "active" : "")}
                to="/profile"
              >
                <img src={UserSvg} />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={(navData) => (navData.isActive ? "active" : "")}
                to="/notifs"
              >
                <img src={NotifySvg} />
              </NavLink>
              {notifCount > 0 && (
                <motion.div
                  initial={{ scale: 0.5, y: "50%", opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  className="alert_dot"
                />
              )}
            </NavItem>
            <NavItem>
              <NavLink
                className={(navData) => (navData.isActive ? "active" : "")}
                to="/settings/main"
              >
                <img src={SettingSvg} />
              </NavLink>
            </NavItem>
            <NavItem>
              <div className="span_nav"></div>
            </NavItem>
            <NavItem>
              <img src={PlusSvg} onClick={openAddHandler} />
            </NavItem>
            <NavItem>
              <img src={SearchSvg} onClick={openSearchHandler} />
            </NavItem>
          </div>
        </div>
      </motion.div>
    </Fragment>
  );
}

export default Nav;
