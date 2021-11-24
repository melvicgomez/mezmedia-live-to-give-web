/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * ChallengeListPage
 *
 */

import React, { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import moment from 'moment';
import axiosInstance from 'services';
import styled from 'styled-components';
import { Table, Row, Input } from 'antd';
import Icon, { CloseOutlined } from '@ant-design/icons';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { Colors } from 'theme/colors';
import { Images } from 'images/index';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectCHallengeListPage from './selectors';
import reducer from './reducer';
import saga from './saga';

const List = styled(Table)`
  table,
  tr,
  tbody,
  td,
  thead,
  th {
    color: ${Colors.pureWhite} !important;
    background-color: ${Colors.background} !important;
    border-color: transparent !important;
  }

  tr:not(:nth-child(1)):not(:nth-child(2)) {
    > td {
      border-top: 2px solid ${Colors.bodyText} !important;
    }
  }

  thead,
  th {
    border-bottom: 2px solid ${Colors.bodyText} !important;
  }

  .ant-pagination-item-link,
  .ant-table-pagination.ant-pagination {
    color: ${Colors.pureWhite};

    input {
      background-color: ${Colors.background} !important;
    }
  }

  .ant-table-sticky-header {
    top: 148px !important;
  }

  .ant-table-row-expand-icon {
    background-color: transparent !important;
  }

  .ant-empty-description {
    color: ${Colors.pureWhite};
  }

  .fix-line {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 22px;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }
`;

const SearchBar = styled(Row)`
  position: relative;
  margin-right: 40px;

  input {
    background-color: transparent !important;
    border: none;
    color: ${Colors.pureWhite};
  }

  .ant-input-group-addon {
    background-color: transparent !important;
    border: none;
  }
`;

const FilterBar = styled(Row)`
  margin-left: 40px;

  > div {
    margin-right: 50px;
    cursor: pointer;
  }
`;

const ClearIcon = styled(CloseOutlined)`
  position: absolute;
  right: -25px;
  font-size: 20px;
  margin-left: 5px;
  color: ${Colors.pureWhite};
`;

export function ChallengeListPage({ match, dispatch }) {
  useInjectReducer({ key: 'challengeListPage', reducer });
  useInjectSaga({ key: 'challengeListPage', saga });

  const [challengeList, setChallengeList] = useState([]);
  const [customPagination, setCustomPagination] = useState({
    current: 1,
    pageSize: 200,
    showSizeChanger: false,
    simple: true,
  });
  const [selectedSorter, setSelectedSorter] = useState({
    columnKey: 'challenge_id',
    order: 'descend',
  });
  const [keyword, setKeyword] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(1);

  // for clean up unmount
  const unmounted = useRef(false);

  const columns = [
    {
      title: 'Challenge ID',
      dataIndex: 'challengeId',
      align: 'center',
      key: 'challengeId',
      render: text => (
        <a className="white-text" href={`/admin/challenges/${text}`}>
          {text}
        </a>
      ),
    },
    {
      title: 'Publish Date',
      dataIndex: 'postedDate',
      key: 'postedDate',
      width: 110,
      sorter: true,
      sortOrder:
        selectedSorter &&
        selectedSorter.columnKey === 'postedDate' &&
        selectedSorter.order,
      render: text => (
        <div className={text === 'Unpublished' ? 'error-text' : 'green-text'}>
          {text}
        </div>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 180,
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 280,
      render: text => <div className="white-text fix-line">{text}</div>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 110,
      key: 'type',
    },
    {
      title: 'B Coin',
      dataIndex: 'bcoin',
      key: 'bcoin',
      align: 'center',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: true,
      sortOrder:
        selectedSorter &&
        selectedSorter.columnKey === 'startDate' &&
        selectedSorter.order,
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: true,
      sortOrder:
        selectedSorter &&
        selectedSorter.columnKey === 'endDate' &&
        selectedSorter.order,
    },
  ];

  useEffect(() => {
    getList(1);

    return () => {
      unmounted.current = true;
    };
  }, []);

  const getList = (page, search = '', filter = 1, sorter = null) => {
    let api = `api/admin/all-challenges?page=${page}&search=${
      !!search && keyword.trim().length ? search : ''
    }&show_status=${
      filter === 1
        ? 'all'
        : filter === 2
        ? 'team'
        : filter === 3
        ? 'individual'
        : 'untrack'
    }`;

    if (sorter) {
      api += `&order_by=${
        sorter.columnKey === 'postedDate'
          ? 'published_at'
          : sorter.columnKey === 'startDate'
          ? 'started_at'
          : 'ended_at'
      }&sort_by=${sorter.order === 'ascend' ? 'asc' : 'desc'}`;
    }

    axiosInstance.get(api).then(res => {
      if (!unmounted.current) {
        setSelectedFilter(filter);
        const details = res.data.data;
        const newList = details.map(d => ({
          key: d.challenge_id,
          challengeId: d.challenge_id,
          postedDate: d.published_at
            ? moment
                .utc(d.published_at)
                .local()
                .format('DD/MM/yyyy HH:mm')
            : 'Unpublished',
          title: d.title,
          description: d.description,
          type: d.is_trackable
            ? d.is_team_challenge
              ? 'Team'
              : 'Individual'
            : 'Non-Trackable',
          startDate: moment.utc(d.started_at).format('DD/MM/yyyy HH:mm'),
          endDate: moment.utc(d.ended_at).format('DD/MM/yyyy HH:mm'),
          action: d,
          htmlContent: d.html_content,
          target: d.is_trackable ? [d.type, d.target_unit, d.target_goal] : [],
          bcoin: d.bcoin_reward || 0,
        }));
        setChallengeList(newList);

        setSelectedSorter(
          sorter
            ? {
                columnKey: sorter.columnKey,
                order: sorter.order,
              }
            : null,
        );

        setCustomPagination({
          ...customPagination,
          current: page,
          total: res.data.total,
        });
      }
    });
  };

  // const deleteFeed = () => {
  //   axiosInstance
  //     .delete(`api/admin/all-officials/${selectedFeed}`)
  //     .then(() => {
  //       setDeleteModalVisible(false);

  //       getList(customPagination.current, keyword, selectedFilter);
  //     })
  //     .catch(() => {
  //       setDeleteModalVisible(false);
  //     });
  // };

  const handleTableChange = (pagination, filter, sorter) => {
    window.scrollTo(0, 0);
    getList(
      pagination.current,
      keyword,
      selectedFilter,
      sorter.column
        ? {
            columnKey: sorter.columnKey,
            order: sorter.order,
          }
        : null,
    );
  };

  return (
    <div>
      <Helmet>
        <title>Admin Panel - Live to Give</title>
        <meta name="description" content="Live to Give" />
      </Helmet>
      <AdminNavigationWrapperComponent
        match={match}
        topTab={
          <Row style={{ width: '100%' }} justify="space-between">
            <Row align="middle">
              <SearchBar align="middle">
                <Input
                  className="bodyBold white-text"
                  placeholder="Search"
                  style={{ width: '150px' }}
                  value={keyword}
                  addonBefore={
                    <Icon
                      onClick={() => {
                        getList(1, keyword, selectedFilter);
                      }}
                      component={() => (
                        <img
                          src={Images.searchIcon}
                          style={{ height: '24px', width: '24px' }}
                          alt="search"
                        />
                      )}
                    />
                  }
                  onPressEnter={() => {
                    getList(1, keyword, selectedFilter);
                  }}
                  onChange={e => {
                    setKeyword(e.target.value);
                  }}
                />
                {!!keyword && (
                  <ClearIcon
                    onClick={() => {
                      setKeyword('');
                      getList(1, '', selectedFilter);
                    }}
                  />
                )}
              </SearchBar>
              <FilterBar className="bodyBold">
                <div
                  className={selectedFilter === 1 ? 'cyan-text' : 'white-text'}
                  onClick={() => getList(1, keyword, 1, null)}
                >
                  Show All
                </div>
                <div
                  className={selectedFilter === 2 ? 'cyan-text' : 'white-text'}
                  onClick={() => getList(1, keyword, 2, null)}
                >
                  Show Team
                </div>
                <div
                  className={selectedFilter === 3 ? 'cyan-text' : 'white-text'}
                  onClick={() => getList(1, keyword, 3, null)}
                >
                  Show Individual
                </div>
                <div
                  className={selectedFilter === 4 ? 'cyan-text' : 'white-text'}
                  onClick={() => getList(1, keyword, 4, null)}
                >
                  Show Non-Trackable
                </div>
              </FilterBar>
            </Row>
            <PrimaryButtonComponent
              style={{
                padding: '0px 20px',
                marginiRght: '10px',
                marginTop: '5px',
                display: 'flex',
                justifyContent: 'center',
              }}
              label="Create"
              onClick={() => dispatch(push('../../admin/challenge/create'))}
              iconRight={false}
            />
          </Row>
        }
      >
        <>
          <List
            className="bodyBold white-text"
            columns={columns}
            dataSource={challengeList}
            sticky
            onChange={handleTableChange}
            pagination={customPagination}
            showSorterTooltip={false}
            expandable={{
              expandedRowRender: record => (
                <>
                  {!!record.target.length && (
                    <>
                      <Row>
                        <div
                          className="bodyBold"
                          style={{ width: '200px', marginBottom: '5px' }}
                        >
                          Target Activity
                        </div>
                        <div>{record.target[0]}</div>
                      </Row>
                      <Row>
                        <div
                          className="bodyBold"
                          style={{ width: '200px', marginBottom: '5px' }}
                        >
                          Target Unit
                        </div>
                        <div>
                          {record.target[2]}{' '}
                          {record.target[1] === 'distance'
                            ? 'km'
                            : record.target[1] === 'duration'
                            ? 'hrs'
                            : 'calories'}
                        </div>
                      </Row>
                    </>
                  )}
                  <Row wrap={false}>
                    <div
                      className="bodyBold"
                      style={{ width: '200px', minWidth: '200px' }}
                    >
                      HTML Content
                    </div>
                    <p
                      style={{
                        marginBottom: '5px',
                        whiteSpace: 'pre-line',
                        wordWrap: 'break-word',
                      }}
                    >
                      {record.htmlContent}
                    </p>
                  </Row>
                </>
              ),
              // rowExpandable: record => record.name !== 'Not Expandable',
            }}
          />
        </>
      </AdminNavigationWrapperComponent>
    </div>
  );
}

ChallengeListPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  challengeListPage: makeSelectCHallengeListPage(),
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
)(ChallengeListPage);
