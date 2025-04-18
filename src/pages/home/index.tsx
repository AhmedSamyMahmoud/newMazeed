import React from "react";
import { useAuth } from "../../apis/auth";
import { withAuthManager } from "../../HOCs/authManager";
import "./styles.scss";
import facebookIcon from "../../assets/Icon/social/facebook.svg";
import tiktokIcon from "../../assets/Icon/social/tiktok.svg";
import instagramIcon from "../../assets/Icon/social/instagram.svg";
import youtubeIcon from "../../assets/Icon/social/youtube.svg";

function Home() {
  const auth = useAuth();
  return (
    <div className="home-container">
      <div className="home-container-header">
        <div style={{ fontSize: "38px", textAlign: "center" }}>mazeed.ai</div>
        <p className="home-container-header-title">Connect Your Social Media</p>
        <p className="home-container-header-description">
          Choose the platforms you want to connect with
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexDirection: window.innerWidth < 900 ? "column" : "row",
        }}
      >
        <button className="social-option">
          <img
            src={facebookIcon}
            style={{ width: "24px", height: "24px", marginRight: "10px" }}
            alt="facebook"
          />
          Facebook
        </button>
        <button className="social-option">
          <img
            src={tiktokIcon}
            style={{ width: "24px", height: "24px", marginRight: "10px" }}
            alt="tiktok"
          />
          TikTok
        </button>
        <button className="social-option">
          <img
            src={instagramIcon}
            style={{ width: "24px", height: "24px", marginRight: "10px" }}
            alt="instagram"
          />
          Instagram
        </button>
        <button className="social-option">
          <img
            src={youtubeIcon}
            style={{ width: "24px", height: "24px", marginRight: "10px" }}
            alt="youtube"
          />
          YouTube
        </button>
      </div>
      <button style={{ marginTop: "40px" }} onClick={() => auth.logout()}>
        Logout
      </button>
    </div>
  );
}

export default withAuthManager(Home);
