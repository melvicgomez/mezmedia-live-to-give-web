/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * TutorialSlideComponent
 *
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from 'services';
import { Row, Modal, Carousel } from 'antd';
import { reactLocalStorage } from 'reactjs-localstorage';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';

const PopupModel = styled(Modal)`
  background-color: ${Colors.pureWhite};
  border-radius: 16px;
  width: 460px !important;
  height: 630px;
  color: ${Colors.bodyText};
  overflow: hidden;
  margin: 20px 0px;

  .ant-modal-body {
    padding: 0px;
  }

  > .ant-modal-content {
    box-shadow: none;
    padding-bottom: 0px;

    > button {
      color: ${Colors.pureWhite};
      top: -19px;
      right: -38px;
    }
  }
`;

const FeaturedCarousel = styled(Carousel)`
  border-radius: 16px;
  overflow: hidden;
`;

const Slide = styled.div`
  height: 620px;
  padding: 20px 45px;

  .paragraph {
    margin-bottom: 20px;
  }
  .title {
    margin: 10px 0px 15px;
    width: 80%;
  }

  .image-placeholder {
    height: 180px;
    margin-bottom: 25px;
  }

  .content {
    width: 90%;

    p {
      margin-bottom: 20px;
    }
  }
`;

const DotIndicator = styled(Row)`
  position: absolute;
  bottom: 20px;
  width: 100%;
`;

const Dot = styled.div`
  height: 13px;
  margin: 0px 6px;
  width: 13px;
  border-radius: 20px;
  background-color: ${props =>
    props.current ? Colors.primary : Colors.mediumGray};
`;

function TutorialSlideComponent({ modalVisible, dismissModal }) {
  const user = reactLocalStorage.getObject('user');
  const [index, setIndex] = useState(0);

  const [loading, setLoading] = useState(false);

  const updateStatus = () => {
    setLoading(true);
    axiosInstance
      .post('api/user', {
        user_id: user.user_id,
        tutorial_web_done: 1,
      })
      .then(async ({ data }) => {
        reactLocalStorage.setObject('user', data.data.user);
        setLoading(false);
        dismissModal();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const SampleNextArrow = props => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          right: '5px',
        }}
        onClick={index === 4 ? () => {} : onClick}
      >
        {index < 4 && (
          <img
            src={Images.rightArrowBlue}
            alt="next"
            style={{ width: '10px', height: '20px' }}
          />
        )}
      </div>
    );
  };

  const SamplePrevArrow = props => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'block',
          left: '10px',
          zIndex: 9,
        }}
        onClick={index === 0 ? () => {} : onClick}
      >
        {index > 0 && (
          <img
            src={Images.rightArrowBlue}
            alt="prev"
            style={{
              width: '10px',
              height: '20px',
              transform: 'scaleX(-1)',
              marginLeft: '5px',
            }}
          />
        )}
      </div>
    );
  };

  const settings = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <PopupModel
      centered
      maskClosable={false}
      destroyOnClose
      visible={modalVisible}
      closable={false}
      maskStyle={{ backgroundColor: 'rgb(0 0 0 / 85%)' }}
      onCancel={() => {
        dismissModal();
      }}
      style={{ backgroundColor: Colors.pureWhite }}
      footer={null}
    >
      <FeaturedCarousel
        arrows
        {...settings}
        beforeChange={(from, to) => setIndex(to)}
        dots={false}
      >
        <Slide>
          <h3 className="h3 darkGrey-text title">Dear {user.first_name},</h3>
          <div className="paragraph">
            <p className="body darkGrey-text">
              Thank you for your continued commitment and resilience through
              what has been an extremely challenging period.
            </p>
          </div>
          <div className="paragraph">
            <p className="body darkGrey-text">
              Live to Give (in partnership with Just Challenge) is an exciting
              initiative that provides you with an opportunity to connect with
              your colleagues across Asia Pacific, join inclusive virtual clubs,
              achieve your wellbeing goals and raise money for charity.
            </p>
          </div>
          <div className="paragraph">
            <p className="body darkGrey-text">
              I look forward to engaging with you over the next three months
              during our Live to Give journey together.
            </p>
          </div>
          <div className="paragraph">
            <p className="body darkGrey-text">Get ready to Live to Give!</p>
          </div>
          <div style={{ marginTop: '30px' }}>
            <p className="body darkGrey-text">Best Wishes,</p>
            <p className="bodyBold darkGrey-text">Jaideep Khanna</p>
            <p className="caption darkGrey-text">
              Head of Barclays, Asia Pacific
            </p>
          </div>
        </Slide>
        <Slide>
          <Row justify="center" style={{ height: '50px' }}>
            <h3 className="h3 darkGrey-text title center">
              Join inclusive Virtual Clubs
            </h3>
          </Row>
          <Row justify="center" align="bottom" className="image-placeholder">
            <img
              src={Images.tutorial1}
              style={{ height: '180px', width: '225px' }}
              alt="slide1"
            />
          </Row>
          <Row justify="center">
            <div className="center body darkGrey-text content">
              <p>
                Join Virtual Clubs that span across Culture, Wellbeing, Fitness
                and Purpose. There’s something for everyone.
              </p>
              <p>
                Engage in tailored content from our Experts and Live Sessions
                with our inspiring Thought Leaders.
              </p>
              <p>
                Share your stories, advice, tips and tricks with communities of
                fellow Asia Pacific colleagues.
              </p>
            </div>
          </Row>
        </Slide>
        <Slide>
          <Row justify="center" style={{ height: '50px' }}>
            <h3
              className="h3 darkGrey-text title center"
              style={{ width: '90%' }}
            >
              Connect with Likeminded Colleagues
            </h3>
          </Row>
          <Row justify="center" align="bottom" className="image-placeholder">
            <img
              src={Images.tutorial2}
              style={{ height: '180px', width: '290px' }}
              alt="slide2"
            />
          </Row>
          <Row justify="center">
            <div className="center body darkGrey-text content">
              <p>
                Connect with colleagues regionally via the Live to Give Activity
                Feed.
              </p>
              <p>
                Post photos of your achievements and like and comment on your
                colleagues’ posts to encourage them on their journey.
              </p>
              <p>Join Virtual Meetups to stay connected with one another.</p>
            </div>
          </Row>
        </Slide>
        <Slide>
          <Row justify="center" style={{ height: '50px' }}>
            <h3 className="h3 darkGrey-text title center">
              Achieve your Wellbeing Goals
            </h3>
          </Row>
          <Row justify="center" align="bottom" className="image-placeholder">
            <img
              src={Images.tutorial3}
              style={{ height: '180px', width: '310px' }}
              alt="slide3"
            />
          </Row>
          <Row justify="center">
            <div className="center body darkGrey-text content">
              <p>
                Participate in Challenges to earn B Coins – individually or as a
                team.
              </p>
              <p>
                Track your fitness activities by integrating with Strava, Apple
                Health, Google Fit or Fitbit.
              </p>
              <p>
                Level-up from Bronze whilst you move up the leaderboards and win
                prizes!
              </p>
            </div>
          </Row>
          <Row
            justify="space-between"
            align="middle"
            style={{ margin: '0px 10px' }}
          >
            <img
              src={Images.fitness.stravaButton}
              style={{ height: '28px', width: '155px' }}
              alt="strava"
            />
            <img
              src={Images.fitness.appleButton}
              style={{ height: '39px', width: '156px' }}
              alt="apple"
            />
          </Row>
          <Row
            justify="space-between"
            align="middle"
            style={{ margin: '15px 10px 0px' }}
          >
            <img
              src={Images.fitness.googleButton}
              style={{ height: '39px', width: '156px' }}
              alt="google"
            />
            <img
              src={Images.fitness.fitbitButton}
              style={{ height: '39px', width: '156px' }}
              alt="fitbit"
            />
          </Row>
        </Slide>
        <Slide>
          <Row justify="center" style={{ height: '50px' }}>
            <h3
              className="h3 darkGrey-text title center"
              style={{ width: '90%' }}
            >
              Raise money for Charity! 
            </h3>
          </Row>
          <Row justify="center" align="bottom" className="image-placeholder">
            <img
              src={Images.tutorial4}
              style={{ height: '180px', width: '290px' }}
              alt="slide4"
            />
          </Row>
          <Row justify="center">
            <div className="center body darkGrey-text content">
              <p>And the best part?</p>
              <p>
                Help make a difference to our communities impacted by COVID-19.
              </p>
              <p>
                Your B Coins will be converted into cash donations for 9
                charities across Asia Pacific.
              </p>
            </div>
          </Row>
          <Row justify="center">
            <PrimaryButtonComponent
              style={{ margin: '25px 0px 0px' }}
              label="Let’s Live to Give!"
              onClick={updateStatus}
              iconRight={false}
              loading={loading}
            />
          </Row>
        </Slide>
      </FeaturedCarousel>
      {index < 4 && (
        <DotIndicator justify="center">
          <Dot current={index === 0} />
          <Dot current={index === 1} />
          <Dot current={index === 2} />
          <Dot current={index === 3} />
          <Dot current={index === 4} />
        </DotIndicator>
      )}
    </PopupModel>
  );
}

TutorialSlideComponent.propTypes = {};

export default TutorialSlideComponent;
