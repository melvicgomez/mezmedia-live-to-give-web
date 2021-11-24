/* eslint-disable no-nested-ternary */
/**
 *
 * TeamListPage
 *
 */

import React, { memo, useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectTeamListPage from './selectors';
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

const ClearIcon = styled(CloseOutlined)`
  position: absolute;
  right: -25px;
  font-size: 20px;
  margin-left: 5px;
  color: ${Colors.pureWhite};
`;

export function TeamListPage({ match }) {
  useInjectReducer({ key: 'teamListPage', reducer });
  useInjectSaga({ key: 'teamListPage', saga });

  const [teamList, setTeamList] = useState([]);
  const [customPagination, setCustomPagination] = useState({
    current: 1,
    pageSize: 200,
    showSizeChanger: false,
    simple: true,
  });
  const [keyword, setKeyword] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(1);

  // for clean up unmount
  const unmounted = useRef(false);

  const columns = [
    {
      title: 'Team ID',
      dataIndex: 'teamId',
      align: 'center',
      key: 'teamId',
      render: text => (
        <a className="white-text" href={`/admin/teams/${text}`}>
          {text}
        </a>
      ),
    },
    {
      title: 'Team Name',
      dataIndex: 'teamName',
      key: 'teamName',
    },
    {
      title: 'Team Code',
      dataIndex: 'teamCode',
      key: 'teamCode',
    },
    {
      title: 'Leader',
      dataIndex: 'leader',
      key: 'leader',
    },
    {
      title: 'Challenge',
      dataIndex: 'challenge',
      key: 'challenge',
      width: 250,
    },
    {
      title: '#Participants',
      dataIndex: 'participants',
      align: 'center',
      width: 130,
      key: 'participants',
    },
    {
      title: 'Private',
      dataIndex: 'private',
      align: 'center',
      key: 'private',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
    },
  ];

  useEffect(() => {
    getList(1);

    return () => {
      unmounted.current = true;
    };
  }, []);

  const getList = (page, search = '', filter = 1) => {
    axiosInstance
      .get(
        `api/admin/all-teams?page=${page}&search=${
          !!search && keyword.trim().length ? search : ''
        }`,
      )
      .then(res => {
        if (!unmounted.current) {
          setSelectedFilter(filter);
          const details = res.data.data;
          const newList = details.map(d => ({
            key: d.team_id,
            teamId: d.team_id,
            teamName: d.team_name,
            teamCode: d.team_code,
            leader: `${d.leader_first_name} ${d.leader_last_name}`,
            challenge: d.challenge_name,
            participants: d.participants.length,
            private: d.is_private ? 'Yes' : 'No',
            createdDate: moment
              .utc(d.created_at)
              .local()
              .format('DD/MM/yyyy HH:mm'),
          }));
          setTeamList(newList);

          setCustomPagination({
            ...customPagination,
            current: page,
            total: res.data.total,
          });
        }
      });
  };

  const handleTableChange = pagination => {
    window.scrollTo(0, 0);
    getList(pagination.current, keyword, selectedFilter);
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
            </Row>
          </Row>
        }
      >
        <>
          <List
            className="bodyBold white-text"
            columns={columns}
            dataSource={teamList}
            sticky
            onChange={handleTableChange}
            pagination={customPagination}
            showSorterTooltip={false}
          />
        </>
      </AdminNavigationWrapperComponent>
    </div>
  );
}

TeamListPage.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  teamListPage: makeSelectTeamListPage(),
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
)(TeamListPage);
