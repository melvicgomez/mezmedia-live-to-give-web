/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * UserHistoryComponent
 *
 */

import React, { useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import axiosInstance from 'services';
import { Row, Col, Spin } from 'antd';
import { Colors } from 'theme/colors';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import BcoinValueComponent from 'components/BcoinValueComponent';
import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';

const LoadingSpinner = styled(LoadingOutlined)`
  font-size: ${props => (props.type === 'bottom' ? '20px' : '40px')};

  ${props =>
    props.type === 'refresh'
      ? css`
          font-size: 30px;
          margin-bottom: 15px;
        `
      : null}
`;

const HistoryList = styled.div`
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;
  padding: 10px 0px;

  > div > div {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;
  }

  > div > div::-webkit-scrollbar {
    display: none;
  }
`;

const DividerLine = styled.div`
  height: 1px;
  background-color: ${Colors.pureWhite};
  margin-top: 35px;
  margin-bottom: 25px;
`;

function UserHistoryComponent({ match }) {
  const [loading, setLoading] = useState(true);
  const [bcoinHistory, setBcoinHistory] = useState([]);

  const [hasNextPage, setHasNextPage] = useState(true);
  const [action, setAction] = useState('delete');
  const [selectedTransactionId, setSelectedTransactionId] = useState(0);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [pageNum, setPageNum] = useState(1);

  // for clean up unmount
  const unmounted = useRef(false);

  useEffect(() => {
    getHistory();

    return () => {
      unmounted.current = true;
    };
  }, []);

  const getHistory = (refresh = false) => {
    const hasMoreData = refresh ? true : hasNextPage;
    const page = refresh ? 1 : pageNum;

    if (hasMoreData) {
      setLoading(true);
      axiosInstance
        .get(
          `api/admin/users-get-history?page=${page}&user_id=${match.params.id}`,
        )
        .then(res => {
          if (!unmounted.current) {
            const historyList = bcoinHistory.concat(res.data.data);
            setBcoinHistory(historyList);
            if (res.data.next_page_url) {
              setPageNum(page + 1);
              setHasNextPage(true);
              setLoading(true);
            } else {
              setPageNum(page);
              setHasNextPage(false);
              setLoading(false);
            }
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <HistoryList className="white-text" style={{ overflow: 'hidden' }}>
      <ConfirmationPopupComponent
        actionRequire
        visibility={showConfirmPopup}
        dismissModal={() => {
          setShowConfirmPopup(false);
        }}
        title={action === 'delete' ? 'Delete B Coin' : 'Restore B Coin'}
        message={
          action === 'delete'
            ? "Do you wish to delete this user's b coin?"
            : "Do you wish to restore this user's b coin?"
        }
        leftAction={() => {
          if (action === 'delete') {
            axiosInstance
              .delete(`/api/bcoins/${selectedTransactionId}`)
              .then(res => {
                const updateBcoin = bcoinHistory.findIndex(
                  bcoin => bcoin.transaction_id === selectedTransactionId,
                );
                bcoinHistory[updateBcoin].deleted_at = res.data.deleted_at;
                setShowConfirmPopup(false);
              });
          }
          if (action === 'restore') {
            axiosInstance
              .put(`/api/bcoins/${selectedTransactionId}`, {
                deleted_at: '',
              })
              .then(res => {
                const updateBcoin = bcoinHistory.findIndex(
                  bcoin => bcoin.transaction_id === selectedTransactionId,
                );
                bcoinHistory[updateBcoin].deleted_at = res.data.deleted_at;
                setShowConfirmPopup(false);
              });
          }
        }}
        rightAction={() => {
          setShowConfirmPopup(false);
        }}
      />
      {loading && bcoinHistory.length === 0 ? (
        <Row justify="center">
          <Spin indicator={<LoadingSpinner spin />} />
        </Row>
      ) : (
        <InfiniteScroll
          dataLength={bcoinHistory.length}
          next={getHistory}
          hasMore={hasNextPage}
          loader={<Spin indicator={<LoadingSpinner type="bottom" spin />} />}
          refreshFunction={() => getHistory(true)}
          endMessage={
            !bcoinHistory.length && (
              <div
                className="h3 cyan-text"
                style={{
                  textAlign: 'center',
                  padding: '80px 0px',
                }}
              >
                <b>There is nothing here yet. Take part in an activity now!</b>
              </div>
            )
          }
          pullDownToRefresh
          pullDownToRefreshThreshold={50}
          pullDownToRefreshContent={
            <Row justify="center">
              <Spin indicator={<LoadingSpinner type="refresh" spin />} />
            </Row>
          }
          releaseToRefreshContent={
            <Row justify="center">
              <Spin indicator={<LoadingSpinner type="refresh" spin />} />
            </Row>
          }
        >
          {bcoinHistory.map(history => (
            <div key={history.transaction_id} className="white-text">
              <div className="captionBold">{`${moment
                .utc(history.created_at)
                .local()
                .format('DD MMM')} at ${moment
                .utc(history.created_at)
                .local()
                .format('h:mmA')}`}</div>
              <div>
                <Row
                  wrap={false}
                  justify="spce-between"
                  align="middle"
                  style={{ marginTop: '6px' }}
                >
                  <Col
                    flex="auto"
                    className="body"
                    style={{ marginRight: '25px' }}
                  >
                    {history.description}
                  </Col>
                  <Col flex="none">
                    <BcoinValueComponent
                      bcoinValue={history.amount}
                      isHistory
                      textStyle={{ color: Colors.positive }}
                      style={{ paddingLeft: '20px' }}
                    />
                  </Col>
                </Row>

                {match.path.startsWith('/admin/users') ? (
                  <div
                    style={{
                      marginTop: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                    className="captionBold"
                  >
                    <div className="white-text">
                      {history.deleted_at ? (
                        <div>
                          Deleted date:{' '}
                          {moment
                            .utc(history.deleted_at)
                            .local()
                            .format('DD/MMM/yyyy hh:mm')}
                        </div>
                      ) : null}
                    </div>
                    {history.deleted_at ? (
                      <div
                        className="green-text"
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onClick={() => {
                          setSelectedTransactionId(history.transaction_id);
                          setAction('restore');
                          setShowConfirmPopup(true);
                        }}
                      >
                        Restore <ReloadOutlined style={{ marginLeft: 6 }} />
                      </div>
                    ) : (
                      <div
                        className="delete-text"
                        style={{
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        onClick={() => {
                          setSelectedTransactionId(history.transaction_id);
                          setAction('delete');
                          setShowConfirmPopup(true);
                        }}
                      >
                        Remove
                        <img
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAZCAYAAAA14t7uAAAABmJLR0QA/wD/AP+gvaeTAAAC80lEQVRIiaWVz2scdRjGP8/M7G4kblBLK2oRodCDSaPJZJuihxQ8WvGgLRTMXdCDV8E/wIPnnvxx0VNBPXrTky2ZXbZNCcWDsSIYNNWUTQjZSb7fx0M2MWtq0k3e0/C8836+zzzzMiMOqdvj48MhTcdDlg0DKMaQxPjTZLv9+0FzOqg512i8kcT4ieAFQ7UnG/gD+Hqq1XrvSOBmnjeRXsa+IWkVwHYqewxpWDHOTLbbt/8X3MzziqU3kxjP7m1aeld2zdJnstf26FeBMeAb2c0dPUgrCXw71Wot6fuLF7P66uoPwAUgPegJHrF+DWn6djbS6bwUpVxwD7h5TOiLwEQWwgdZTJK67CHD/Uar9c5xqM08vwZMRGko21Wl51p5fuM4YMPJnetM9iLwG/azEZ4RbByRmwE1YEX2XQHMnzv3ZFmttmVnIU0vCTqD2/XnsmeAD6darY8TgPE7d1aA0lKlWpbLjaJYJIRZxfiVYuw0imIxCeF9QvhiM8uWGkWxiP2RYrw2VRT3GkWxSG91ewmQ7DmzK7sW0nQEQNJrwAXHOANgaUZJcj7b2hrrAV4BJlt5frrnuAbY0vJOLts6lEiPWaoPHMO2kxr2huxOv2OpC1RlP3Ekrl0FNpIYO32OgbJ3w8mHDR5W3t6IcrNSWe1zLLsLEJPk1KDQhdHRquxKAmWt2+0HezsKkhhPDApeGx6uW6oYtsbn59f7wPSisPTUoOBqWdaBqqHU9vd6fxSyHx8UHNK0ntg1QXdH+3fd7A1JWKoNCrY0YhjqbRb9jqW/YfftwvY3Y91ZttQb7mKvW7rf65dAmYbQIYQTggy73AcG/uqdUAPYyrJZ2W+dL4ofAdIQroY0vTw9N/dL76DLaZJcmbh160EiPQ2wN4rdf14xNfVqYn9neAAsSIqPGkWE52WPSvoybzZn+8AAzTz/FLgEnPpv75Bak31X9uuT7fbyPjDAzenp05XNzbMxTZP98w+vJIQ/fz5zZuHK9ethR/sHReBJW23AKVQAAAAASUVORK5CYII="
                          alt="delete"
                          style={{ width: 12, marginLeft: 6 }}
                        />
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <DividerLine />
            </div>
          ))}
        </InfiniteScroll>
      )}
    </HistoryList>
  );
}

UserHistoryComponent.propTypes = {};

export default UserHistoryComponent;
