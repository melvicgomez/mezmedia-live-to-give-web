/* eslint-disable no-nested-ternary */
/**
 *
 * SideNav
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BcoinValueComponent from 'components/BcoinValueComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import { Button, Layout, Menu } from 'antd';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reactLocalStorage } from 'reactjs-localstorage';

const { Sider } = Layout;

const SideBar = styled(Sider)`
  position: sticky !important;
  top: 68px !important;
  background: ${Colors.background};
  flex: 0 0 300px !important;
  max-width: ${props => (props.admin === 1 ? '270px' : '300px')} !important;
  min-width: ${props => (props.admin === 1 ? '270px' : '300px')} !important;
  width: 300px !important;
  overflow-y: auto;
  height: calc(100vh - 68px);
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  > div {
    position: absolute;
    height: calc(100vh - 68px);
    width: 100%;
    padding: ${props => (props.admin === 1 ? '0 30px' : '0 35px')};
    overflow-y: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;

    & > div {
      height: 100%;
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const SideBarContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: calc(24px + 80px);
  /* 
  80px is based on TabHeaderWrapperStyled's height 
  inside app\components\NavigationWrapperComponent\index.js
  */
`;

const SideBarHeader = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  > div:first-child {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
  }

  > div:nth-child(2) {
    margin-top: 5px;
    margin-bottom: 10px;
  }
`;

const SideBarMenu = styled(Menu)`
  background: ${Colors.background} !important;
  width: 100%;

  li {
    padding: 3px 0px !important;
    height: auto !important;
    color: ${Colors.pureWhite} !important;
    padding-left: ${props => (props.admin === 1 ? '60px' : 0)} !important;
  }

  .ant-menu-item-selected {
    background: ${Colors.background} !important;
  }

  .ant-menu-item > span {
    color: ${Colors.pureWhite} !important;
  }

  .ant-menu-item-selected {
    color: ${Colors.primary} !important;

    > span {
      color: ${Colors.primary} !important;
    }
  }

  .ant-menu-item-divider {
    padding: 2px !important;
    margin-top: 20px !important;
    margin-bottom: 10px !important;
    background-color: ${Colors.primary} !important;
  }
`;

const SideBarMenuIcon = styled.img`
  width: 33px;
  height: 33px;
  object-fit: contain;
`;

const InfoButton = styled.div`
  margin-top: 5px;
  margin-right: 10px;
  border-radius: 50px;
  width: 14px;
  height: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  cursor: pointer;

  > img {
    height: 20px;
    width: 15px;
    object-fit: contain;
  }
`;

const SubContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  padding-top: 40px;
`;

const SubContentLink = styled(Button)`
  border: none;
  outline: none;
  padding: 0px;
  background-color: ${Colors.transparent};

  &:focus {
    color: ${Colors.pureWhite};
  }
`;

const SubContentText = styled.a``;

const SubContentFooter = styled.p`
  margin-top: 13px;

  :last-child {
    margin-bottom: 15px;
  }
`;

const Logo = styled.img`
  height: 74px;
  width: 197px;
  margin-left: -4px;
  margin-top: ${props => (props.admin ? '10px' : '5px')};
`;

function SideNav({ match, dispatch, admin }) {
  const user = reactLocalStorage.getObject('user');

  const navigationOption = [
    {
      id: 1,
      title: 'Rankings',
      name: 'ranking',
      icon: 'rankingIcon',
      slug: '/ranking',
    },
    {
      id: 2,
      title: 'Activity Feed',
      name: 'feeds',
      icon: 'activityIcon',
      slug: '/activity-feed',
    },
    {
      id: 3,
      title: 'My Clubs',
      name: 'clubs',
      icon: 'clubIcon',
      slug: '/my-clubs',
    },
    {
      id: 4,
      title: 'Challenges',
      name: 'challenges',
      icon: 'challengeIcon',
      slug: '/challenges',
    },
    {
      id: 5,
      title: 'Live Sessions',
      name: 'lives',
      icon: 'liveIcon',
      slug: '/live-sessions',
    },
    {
      id: 6,
      title: 'Meetups',
      name: 'meetup',
      icon: 'meetupIcon',
      slug: '/meetups',
    },
    {
      id: 7,
      title: 'Charities',
      name: 'charity',
      icon: 'charityIcon',
      slug: '/charities',
    },
    {
      id: 8,
      title: 'About Live to Give',
      name: 'about',
      icon: null,
      slug: '/about-live-to-give',
    },
  ];

  const adminNavigationOption = [
    {
      id: 0,
      title: 'Dashboard',
      name: 'dashboard',
      slug: '/admin/dashboard',
    },
    {
      id: 1,
      title: 'Users',
      name: 'users',
      slug: '/admin/users',
    },
    {
      id: 2,
      title: 'Posts',
      name: 'posts',
      slug: '/admin/posts',
    },
    {
      id: 3,
      title: 'Comments',
      name: 'comments',
      slug: '/admin/comments',
    },
    {
      id: 4,
      title: 'Official',
      name: 'official',
      slug: '/admin/officials',
    },
    {
      id: 5,
      title: 'Challenges',
      name: 'challenges',
      slug: '/admin/challenges',
    },
    {
      id: 6,
      title: 'Live Sessions',
      name: 'lives',
      slug: '/admin/live-sessions',
    },
    {
      id: 7,
      title: 'Meetups',
      name: 'meetups',
      slug: '/admin/meetups',
    },
    {
      id: 8,
      title: 'Teams',
      name: 'teams',
      slug: '/admin/teams',
    },
    {
      id: 9,
      title: 'Notifications',
      name: 'notifications',
      slug: '/admin/notifications',
    },
    {
      id: 10,
      title: 'Polls',
      name: 'polls',
      slug: '/admin/polls',
    },
    {
      id: 11,
      title: 'Charity Response',
      name: 'charity-response',
      slug: '/admin/charity-response',
    },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SideBar admin={admin ? 1 : 0} className="white-text">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <SideBarContent admin={admin ? 1 : 0}>
          {!admin && (
            <SideBarHeader>
              <div>
                <BcoinValueComponent
                  bcoinValue={user.bcoin_total_sum_amount || 0}
                />
                <InfoButton
                  className="captionBold darkGrey-text"
                  onClick={() => setModalVisible(true)}
                >
                  <img src={Images.infoIcon} alt="info" />
                </InfoButton>
              </div>
              <div className="bodyBold grapefruit-text">
                £
                {((user.bcoin_total_sum_amount || 0) * 0.225)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                Donated to Charity
              </div>
            </SideBarHeader>
          )}
          <SideBarMenu
            theme="dark"
            className="h3"
            mode="inline"
            admin={admin ? 1 : 0}
            defaultSelectedKeys={[
              `${
                admin
                  ? adminNavigationOption.find(v =>
                      (match ? match.path : '/').startsWith(
                        v.slug.slice(0, -1),
                      ),
                    )
                    ? adminNavigationOption.find(v =>
                        (match ? match.path : '/').startsWith(
                          v.slug.slice(0, -1),
                        ),
                      ).id
                    : '0'
                  : navigationOption.find(v =>
                      (match ? match.path : '/').startsWith(v.slug),
                    )
                  ? navigationOption.find(v =>
                      (match ? match.path : '/').startsWith(v.slug),
                    ).id
                  : '0'
              }`,
            ]}
          >
            {admin
              ? adminNavigationOption.map(option => (
                  <Menu.Item
                    key={option.id}
                    className="h3"
                    admin={admin ? 1 : 0}
                    onClick={() => {
                      dispatch(push(option.slug));
                    }}
                  >
                    {option.title}
                  </Menu.Item>
                ))
              : navigationOption.slice(0, -1).map(option => (
                  <Menu.Item
                    key={option.id}
                    className="h3"
                    admin={admin ? 1 : 0}
                    icon={
                      <SideBarMenuIcon src={Images.navigation[option.icon]} />
                    }
                    onClick={() => {
                      dispatch(push(option.slug));
                    }}
                  >
                    {option.title}
                  </Menu.Item>
                ))}
            <Menu.Divider />
            {!admin && (
              <Menu.Item
                key={8}
                className="bodyBold"
                onClick={() => {
                  dispatch(push('/about-live-to-give'));
                }}
              >
                About Live to Give
              </Menu.Item>
            )}
          </SideBarMenu>
        </SideBarContent>
        <div>
          <Logo
            admin={admin ? 1 : 0}
            src={Images.headerTitle}
            alt="headerLogo"
          />
          <SubContent>
            <SubContentLink type="link white-text">
              <SubContentText
                className="captionLink anchor-link"
                href="/settings/contact-us"
              >
                Technical Support
              </SubContentText>
            </SubContentLink>
            <SubContentLink type="link white-text">
              <SubContentText
                className="captionLink anchor-link"
                href="https://support.livetogive.co/"
                target="_blank"
              >
                FAQs
              </SubContentText>
            </SubContentLink>
            <SubContentLink type="link white-text">
              <SubContentText
                className="captionLink anchor-link"
                href="/terms-and-conditions"
              >
                Terms & Conditions
              </SubContentText>
            </SubContentLink>
            <SubContentLink type="link white-text">
              <SubContentText
                className="captionLink anchor-link"
                href="/privacy-policy"
              >
                Privacy Policy
              </SubContentText>
            </SubContentLink>
            <SubContentFooter className="caption">
              ©Live to Give 2021.
            </SubContentFooter>
          </SubContent>
        </div>
        <ConfirmationPopupComponent
          visibility={modalVisible}
          dismissModal={() => {
            setModalVisible(false);
          }}
          title="About Live to Give Fundraising"
          message="When participating in activities within Live to Give, you earn B Coins. The more you engage, the more you earn! Your B Coins will be converted into donations for charities across Asia Pacific. You can support the organisations listed in the Charities module in your country of employment who are working to support vulnerable people impacted by COVID-19, and in alleviating the associated social and economic hardship caused by the crisis."
          actionRequire={false}
        />
      </div>
    </SideBar>
  );
}

SideNav.propTypes = {
  dispatch: PropTypes.func.isRequired,
  admin: PropTypes.bool,
};

SideNav.defaultProps = {
  admin: false,
};

const mapStateToProps = () => ({});
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(SideNav);
