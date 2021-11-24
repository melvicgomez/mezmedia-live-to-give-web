/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/**
 *
 * UserRankingPage
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import qs from 'query-string';
import styled, { css } from 'styled-components';
import { reactLocalStorage } from 'reactjs-localstorage';
import axiosInstance from 'services';
import { Row, Col, Dropdown, Menu } from 'antd';
import { StarFilled } from '@ant-design/icons';
import NavigationWrapperComponent from 'components/NavigationWrapperComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import SearchPopupComponent from 'components/SearchPopupComponent';
import SideProfileComponent from 'components/SideProfileComponent';
import UserAvatarComponent from 'components/UserAvatarComponent';
import BcoinValueComponent from 'components/BcoinValueComponent';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUserRankingPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const countryIcon = {
  'Hong Kong SAR': 'hongKong',
  Singapore: 'singapore',
  Australia: 'australia',
  India: 'india',
  Japan: 'japan',
  China: 'china',
};

const PageWrapperStyled = styled.div`
  border-radius: 16px;
  margin: 15px 0px 20px;
  overflow: hidden;
`;

const Tab = styled(Row)`
  width: 100%;

  > div {
    align-self: center;
    padding: 10px 0px;
    border-top-right-radius: 16px;
    border-top-left-radius: 16px;
    box-shadow: 2px 1px 2px 0px #00000015 inset;
    cursor: pointer;
  }
`;

const Header = styled(Row)`
  height: 89px;
  background-color: ${Colors.disabled};
  padding: 5px 20px;
`;

const CountryInfo = styled(Row)`
  > img {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }
`;

const InfoButton = styled.div`
  background-color: ${Colors.disabled};
  border-radius: 50px;
  width: 14px;
  height: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;

  > img {
    height: 20px;
    width: 15px;
    object-fit: contain;
  }
`;

const FilterBar = styled(Row)`
  height: 60px;
  padding: 0px 20px;
  border-bottom: 3px solid ${Colors.mediumGray};
  background-color: ${Colors.pureWhite};

  > div > div > img {
    height: 28px;
    width: 28px;
    cursor: pointer;
    margin-right: 20px;
  }

  > div {
    cursor: pointer;
  }
`;
const ParticipantStrip = styled(Row)`
  min-height: 80px;
  background-color: ${props =>
    props.ghost
      ? Colors.mediumGray
      : props.user
      ? Colors.grapefruit
      : props.plural
      ? Colors.pureWhite
      : Colors.disabled};
  opacity: ${props => (props.ghost ? 0.5 : 1)};

  ${props =>
    props.type === 'country'
      ? css`
          padding: 8px 20px 12px;
        `
      : css`
          padding: 10px 20px;
        `}
  ${props =>
    !props.user &&
    !props.ghost &&
    css`
      border-bottom: 2px solid
        ${props.plural ? Colors.disabled : Colors.pureWhite};
    `};
`;

const CountryIcon = styled.img`
  height: 22px;
  width: 22px;
  margin: 0px 15px;
`;

const DonateInfo = styled.div`
  position: absolute;
  top: 30px;
  right: 13px;
  white-space: nowrap;
`;

const FavoriteSection = styled.div`
  border: 6px solid ${Colors.primary};
  background-color: ${Colors.mediumGray};
`;

const FavoriteHeader = styled(Row)`
  background-color: ${Colors.primary};
  padding: 10px 15px 5px;
`;

const FavouriteIcon = styled(StarFilled)`
  color: ${Colors.star};
  font-size: 20px;
  margin-right: 8px;
`;

export function UserRankingPage({ match, location, dispatch }) {
  useInjectReducer({ key: 'userRankingPage', reducer });
  useInjectSaga({ key: 'userRankingPage', saga });

  const user = reactLocalStorage.getObject('user');

  const rankOptions = [
    'All Time',
    'Current Month',
    'Current Week',
    'Last Month',
    'Last Week',
  ];

  const rankOptionsOverall = ['All Time Average'];

  const [tabIndex, setTabIndex] = useState(1);
  const [selectedIndexLocal, setSelectedIndexLocal] = useState(0);
  const [selectedIndexRegional, setSelectedIndexRegional] = useState(0);
  const [selectedIndexCountry, setSelectedIndexCountry] = useState(0);

  const [localData, setLocalData] = useState({ favorite: [], list: [] });
  const [regionalData, setRegionalData] = useState({ favorite: [], list: [] });
  const [overallDataCountry, setOverallDataCountry] = useState([]);

  const [localOverallBcoin, setLocalOverallBcoin] = useState(0);
  const [regionalOverallBcoin, setRegionalOverallBcoin] = useState(0);
  const [countryOverallBcoin, setCountryOverallBcoin] = useState(0);

  const [errorModalVisible, setErrorModalVisible] = useState(false);

  let currentSearch = '';

  useEffect(() => {
    const qsParams = qs.parse(location.search);
    currentSearch = qsParams.search || '';
    getAllData();
  }, [location.search]);

  const getAllData = () => {
    fetchData();
    fetchData('regional');
    fetchData('country');
  };

  const fetchData = (scope = 'local', duration, isCurrent) => {
    let url = `/api/ranking?scope=${scope}&country_code=${
      user.country_code
    }&per_page=5000&search=${currentSearch}`;
    if (scope === 'local' || scope === 'regional') {
      url = duration !== null ? `${url}&duration=${duration}` : url;
      url = isCurrent !== null ? `${url}&is_current=${isCurrent}` : url;
    } else url = `/api/ranking/overall?scope=${scope}&is_average=1`;

    axiosInstance.get(url).then(({ data }) => {
      if (scope === 'local') {
        setLocalOverallBcoin(data.bcoin_overall);
        setLocalData({ favorite: data.favorite_users || [], list: data.data });
      }
      if (scope === 'regional') {
        setRegionalOverallBcoin(data.bcoin_overall);
        setRegionalData({
          favorite: data.favorite_users || [],
          list: data.data,
        });
      }
      if (scope === 'country') {
        setCountryOverallBcoin(data.bcoin_overall);
        setOverallDataCountry(data.data);
      }
    });
  };

  const toogleFavorite = data => {
    axiosInstance
      .post('api/favorite-users', {
        favorite_user_id: data.user_id,
      })
      .then(() => {
        getAllData();
      })
      .catch(error => {
        if (error.status === 422) {
          setErrorModalVisible(true);
        }
      });
  };

  const getSelectedIndex = type => {
    if (type === 'local') return selectedIndexLocal;
    if (type === 'regional') return selectedIndexRegional;
    if (type === 'country') return selectedIndexCountry;
  };

  const SectionHeader = ({ type = 'local' }) => {
    const [modalVisibleCharity, setModalVisibleCharity] = useState(false);
    const jumpToRank = () => {
      const target = document.getElementById('user');

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    };

    const onClick = ({ key }) => {
      key = parseInt(key, 10);
      if (type === 'local' || type === 'regional') {
        fetchData(
          type,
          key === 0 ? null : key === 1 || key === 3 ? 'month' : 'week',
          key === 0 ? null : key === 1 || key === 2 ? 1 : 0,
        );
      }

      if (type === 'country') {
        fetchData('country');
      }

      if (type === 'local') return setSelectedIndexLocal(key);
      else if (type === 'regional') return setSelectedIndexRegional(key);
      else if (type === 'country') return setSelectedIndexCountry(key);
    };

    const menu = (
      <Menu onClick={onClick}>
        {(tabIndex === 1 || tabIndex === 2
          ? rankOptions
          : rankOptionsOverall
        ).map((option, i) => (
          <Menu.Item key={i}>{option}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <>
        <Header align="middle">
          <Col span={24}>
            <Row justify="space-between">
              <CountryInfo className="h2 cyan-text" align="middle">
                {type === 'local' && (
                  <img
                    src={Images.country[countryIcon[user.country_code]]}
                    alt="country"
                  />
                )}
                {type === 'local'
                  ? user.country_code
                  : type === 'regional'
                  ? 'Regional Overall'
                  : 'Office Average'}
              </CountryInfo>
              <Col justify="center" className="captionBold cyan-text">
                <Row align="end">
                  <BcoinValueComponent
                    bcoinValue={
                      type === 'local'
                        ? localOverallBcoin
                        : type === 'regional'
                        ? regionalOverallBcoin
                        : countryOverallBcoin
                    }
                  />
                </Row>
                {type !== 'country' ? (
                  <Row align="middle" style={{ margin: '5px 0px 0px' }}>
                    £
                    {(
                      (type === 'local'
                        ? localOverallBcoin
                        : type === 'regional'
                        ? regionalOverallBcoin
                        : countryOverallBcoin) * 0.225
                    )
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                    Donated to Charity
                    <InfoButton
                      className="captionBold darkGrey-text"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setModalVisibleCharity(true)}
                    >
                      <img src={Images.infoIcon} alt="info" />
                    </InfoButton>
                  </Row>
                ) : null}
              </Col>
            </Row>
          </Col>
        </Header>
        <FilterBar
          justify={type !== 'country' ? 'space-between' : 'end'}
          align="middle"
        >
          {type !== 'country' && (
            <SearchPopupComponent
              location={location}
              dispatch={dispatch}
              type="user"
            />
          )}
          <Row>
            {type !== 'country' && (
              <div role="button" tabIndex="-1" onClick={jumpToRank}>
                <img src={Images.jumpToRankIcon} alt="jump_to_rank" />
              </div>
            )}
            {type === 'country' ? (
              <div
                className="bodyLink darkGrey-text"
                style={{ cursor: 'default' }}
              >
                Shows: {rankOptionsOverall[getSelectedIndex(type)]}
              </div>
            ) : (
              <Dropdown overlay={menu} placement="bottomRight" arrow>
                <div className="bodyLink darkGrey-text">
                  Shows:{' '}
                  {
                    (tabIndex === 1 || tabIndex === 2
                      ? rankOptions
                      : rankOptionsOverall)[getSelectedIndex(type)]
                  }
                </div>
              </Dropdown>
            )}
          </Row>
        </FilterBar>
        <ConfirmationPopupComponent
          visibility={modalVisibleCharity}
          dismissModal={() => {
            setModalVisibleCharity(false);
          }}
          title="About Live to Give Fundraising"
          message="When participating in activities within Live to Give, you earn B Coins. The more you engage, the more you earn! Your B Coins will be converted into donations for charities across Asia Pacific. You can support the organisations listed in the Charities module in your country of employment who are working to support vulnerable people impacted by COVID-19, and in alleviating the associated social and economic hardship caused by the crisis. "
          actionRequire={false}
        />
      </>
    );
  };

  const LocalRanking = () =>
    !localData.list.length ? (
      <p
        className="h3 darkGrey-text"
        style={{ textAlign: 'center', padding: '40px 0px' }}
      >
        <b>No Users Found</b>
      </p>
    ) : (
      localData.list.map((data, i) => (
        <ParticipantRow key={i} data={data} index={i} />
      ))
    );

  const RegionalRanking = () =>
    !regionalData.list.length ? (
      <p
        className="h3 darkGrey-text"
        style={{ textAlign: 'center', padding: '40px 0px' }}
      >
        <b>No Users Found</b>
      </p>
    ) : (
      regionalData.list.map((data, i) => (
        <ParticipantRow key={i} data={data} index={i} />
      ))
    );

  const OverallRanking = () => (
    <>
      {overallDataCountry.map((data, i) => (
        <ParticipantStrip
          justify="space-between"
          align="middle"
          wrap={false}
          key={i}
          id="country"
          plural={i % 2 === 0 ? 1 : 0}
          user={data.key === user.country_code ? 1 : 0}
          ghost={data.is_ghost || 0}
          type="country"
        >
          <Row
            align="middle"
            className={`${
              data.key === user.country_code ? 'white-text' : 'darkGrey-text'
            }`}
            wrap={false}
          >
            <div
              className="bodyBold"
              style={{ minWidth: '40px', marginRight: '10px' }}
            >
              #{i + 1}
            </div>

            <CountryIcon src={Images.country[countryIcon[data.key]]} />
            <Col
              flex="auto"
              className={`body ${
                data.key === user.country_code ? 'white-text' : 'darkGrey-text'
              }`}
            >
              <div>{data.key}</div>
            </Col>
          </Row>
          <Col
            flex="none"
            className={`bodyBold ${
              data.user_id === user.user_id ? 'white-text' : 'cyan-text'
            }`}
            style={{ marginLeft: '15px', position: 'relative' }}
          >
            <Row align="end">
              <BcoinValueComponent
                original={data.key !== user.country_code}
                bcoinValue={data.bcoin_total}
                style={{
                  backgroundColor: 'transparent',
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                  marginVertical: 0,
                  marginBottom: 6,
                }}
                textStyle={{
                  fontWeight: 'bold',
                  color:
                    data.key === user.country_code
                      ? Colors.white
                      : Colors.bodyText,
                }}
              />
            </Row>
            <DonateInfo
              align="middle"
              className="captionBold"
              style={{
                color:
                  data.key === user.country_code
                    ? Colors.white
                    : Colors.primary,
              }}
            >
              Average no. of coins per {data.key} user
            </DonateInfo>
          </Col>
        </ParticipantStrip>
      ))}
    </>
  );

  const ParticipantRow = ({ data, index }) => {
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    return (
      <>
        <ParticipantStrip
          justify="space-between"
          align="middle"
          wrap={false}
          key={index}
          id={data.user_id === user.user_id ? 'user' : 'participant'}
          plural={index % 2 === 0 ? 1 : 0}
          user={data.user_id === user.user_id ? 1 : 0}
          style={{ cursor: 'pointer' }}
          ghost={data.is_ghost || 0}
          onClick={() => setShowConfirmPopup(true)}
        >
          <Row
            align="middle"
            className={`${
              data.user_id === user.user_id ? 'white-text' : 'darkGrey-text'
            }`}
            wrap={false}
          >
            <div
              className="bodyBold"
              style={{ minWidth: '40px', marginRight: '10px' }}
            >
              {!data.is_ghost ? `#${data.ranking}` : ''}
            </div>
            <UserAvatarComponent user={data} list />
            <CountryIcon src={Images.country[countryIcon[data.country_code]]} />
            <Col
              flex="auto"
              className={`body ${
                data.user_id === user.user_id ? 'white-text' : 'darkGrey-text'
              }`}
            >
              <div>
                {data.first_name} {data.last_name}
              </div>
            </Col>
          </Row>
          <Col
            flex="none"
            className={`bodyBold ${
              data.user_id === user.user_id ? 'white-text' : 'cyan-text'
            }`}
            style={{ marginLeft: '15px' }}
          >
            {!data.is_ghost && (
              <BcoinValueComponent
                original={data.user_id !== user.user_id}
                bcoinValue={data.bcoin_total_rank || 0}
                style={{
                  backgroundColor: 'transparent',
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                  marginVertical: 0,
                  marginBottom: 6,
                }}
                textStyle={{
                  fontWeight: 'bold',
                  color:
                    data.user_id === user.user_id
                      ? Colors.white
                      : Colors.bodyText,
                }}
              />
            )}
          </Col>
        </ParticipantStrip>
        <ConfirmationPopupComponent
          actionRequire
          visibility={showConfirmPopup}
          dismissModal={() => {
            setShowConfirmPopup(false);
          }}
          title={
            data.is_favorite
              ? 'Remove from Your Favourites List'
              : 'Add to Your Favourites list'
          }
          message={
            data.is_favorite
              ? `Remove ${data.first_name} ${
                  data.last_name
                } from your favourites list?`
              : `Add ${data.first_name} ${
                  data.last_name
                } to your favourites list?`
          }
          leftAction={() => {
            toogleFavorite(data);
            setShowConfirmPopup(false);
          }}
          rightAction={() => {
            setShowConfirmPopup(false);
          }}
        />
      </>
    );
  };
  return (
    <div>
      <Helmet>
        <title>Rankings - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <NavigationWrapperComponent
        match={match}
        rightContent={
          <div>
            <SideProfileComponent />
          </div>
        }
      >
        <PageWrapperStyled>
          <Tab className="cyan-text h3">
            <Col
              align="middle"
              span={8}
              style={{
                backgroundColor:
                  tabIndex === 1 ? Colors.pureWhite : Colors.mediumGray,
                color: tabIndex === 1 ? Colors.primary : Colors.pureWhite,
              }}
              onClick={() => setTabIndex(1)}
            >
              Local
            </Col>
            <Col
              align="middle"
              span={8}
              style={{
                backgroundColor:
                  tabIndex === 2 ? Colors.pureWhite : Colors.mediumGray,
                color: tabIndex === 2 ? Colors.primary : Colors.pureWhite,
              }}
              onClick={() => setTabIndex(2)}
            >
              Regional
            </Col>
            <Col
              align="middle"
              span={8}
              style={{
                backgroundColor:
                  tabIndex === 3 ? Colors.pureWhite : Colors.mediumGray,
                color: tabIndex === 3 ? Colors.primary : Colors.pureWhite,
              }}
              onClick={() => setTabIndex(3)}
            >
              Office
            </Col>
          </Tab>
          <div style={{ backgroundColor: Colors.pureWhite }}>
            {tabIndex === 1 ? (
              <SectionHeader type="local" />
            ) : tabIndex === 2 ? (
              <SectionHeader type="regional" />
            ) : (
              <SectionHeader type="country" />
            )}
            {((tabIndex === 1 && !!localData.favorite.length) ||
              (tabIndex === 2 && !!regionalData.favorite.length)) && (
              <>
                <FavoriteHeader align="middle">
                  <FavouriteIcon />
                  <div className="white-text h3">Your Favourites</div>
                </FavoriteHeader>
                <FavoriteSection>
                  {(tabIndex === 1 ? localData : regionalData).favorite.map(
                    (data, i) => (
                      <ParticipantRow key={i} data={data} index={i} />
                    ),
                  )}
                </FavoriteSection>
              </>
            )}
            {tabIndex === 1 ? (
              <LocalRanking />
            ) : tabIndex === 2 ? (
              <RegionalRanking />
            ) : (
              <OverallRanking />
            )}
          </div>
          <ConfirmationPopupComponent
            actionRequire={false}
            visibility={errorModalVisible}
            dismissModal={() => {
              setErrorModalVisible(false);
            }}
            title="Maximum Reached"
            message="You can only have a maximum of 5 favourites in your list"
          />
        </PageWrapperStyled>
      </NavigationWrapperComponent>
    </div>
  );
}

UserRankingPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  userRankingPage: makeSelectUserRankingPage(),
});

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
)(UserRankingPage);
