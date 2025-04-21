import React from "react";
import { useAuth } from "../../apis/auth";
import { withAuthManager } from "../../HOCs/authManager";
import "./styles.scss";
import tiktokIcon from "../../assets/Icon/social/tiktok.svg";
import instagramIcon from "../../assets/Icon/social/instagram.svg";
import youtubeIcon from "../../assets/Icon/social/youtube.svg";

function Home() {
  const auth = useAuth();
  const userID = JSON.parse(localStorage.getItem("token") || "{}")?.userId;
  return (
    <div className="home-container">
      <div className="home-container-header">
        <div className="logo">mazeed.ai</div>
        <h1 className="home-container-header-title">
          Connect Your Social Media
        </h1>
        <p className="home-container-header-description">
          Choose the platforms you want to connect with to start managing your
          social media presence
        </p>
      </div>

      <div className="social-grid">
        <button className="social-option tiktok">
          <img src={tiktokIcon} alt="TikTok" />
          Connect with TikTok
        </button>
        <button
          className="social-option instagram"
          onClick={() => {
            window.open(
              `https://www.facebook.com/v19.0/dialog/oauth?client_id=1135969964508800&redirect_uri=https://api.mazeed.ai/api/oauth/instagram/callback&scope=instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement&state=${userID}&response_type=code`,
              "_blank"
            );
          }}
        >
          <img src={instagramIcon} alt="Instagram" />
          Connect with Instagram
        </button>
        <button className="social-option youtube">
          <img src={youtubeIcon} alt="YouTube" />
          Connect with YouTube
        </button>
      </div>

      <button className="logout-button" onClick={() => auth.logout()}>
        Logout
      </button>
    </div>
  );
}

export default withAuthManager(Home);
