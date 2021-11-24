/* eslint-disable no-nested-ternary */
/**
 *
 * MeetupListPage
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
import makeSelectMeetupListPage from './selectors';
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

export function MeetupListPage({ match, dispatch }) {
  useInjectReducer({ key: 'meetupListPage', reducer });
  useInjectSaga({ key: 'meetupListPage', saga });

  const [meetupList, setMeetupList] = useState([]);
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
      title: 'Meetup ID',
      dataIndex: 'meetupId',
      align: 'center',
      key: 'meetupId',
      render: text => (
        <a className="white-text" href={`/admin/meetups/${text}`}>
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
      width: 150,
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      render: text => <div className="white-text fix-line">{text}</div>,
    },
    {
      title: '#Slot',
      dataIndex: 'slots',
      align: 'center',
      key: 'slots',
    },
    {
      title: 'Host Name',
      dataIndex: 'hostName',
      key: 'hostName',
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
    let api = `api/admin/all-meetups?page=${page}&search=${
      !!search && keyword.trim().length ? search : ''
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
          key: d.meetup_id,
          meetupId: d.meetup_id,
          postedDate: d.published_at
            ? moment
                .utc(d.published_at)
                .local()
                .format('DD/MM/yyyy HH:mm')
            : 'Unpublished',
          title: d.title,
          description: d.description,
          hostName: d.host_name,
          slots: d.slots,
          startDate: moment
            .utc(d.started_at)
            .local()
            .format('DD/MM/yyyy HH:mm'),
          endDate: moment
            .utc(d.ended_at)
            .local()
            .format('DD/MM/yyyy HH:mm'),
          additionalDetails: d.additional_details,
          htmlContent: d.html_content,
          participants: d.participants_count,
          meetingLink: d.virtual_room_link || '-',
          recordingLink: d.recording_link || '-',
          target: d.is_trackable ? [d.type, d.target_unit, d.target_goal] : [],
          bcoin: d.bcoin_reward || 0,
        }));
        setMeetupList(newList);

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
                        if (keyword.trim().length) {
                          getList(1, keyword, selectedFilter);
                        }
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
                    if (keyword.trim().length) {
                      getList(1, keyword, selectedFilter);
                    }
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
            <PrimaryButtonComponent
              style={{
                padding: '0px 20px',
                marginiRght: '10px',
                marginTop: '5px',
                display: 'flex',
                justifyContent: 'center',
              }}
              label="Create"
              onClick={() => dispatch(push('../../admin/meetup/create'))}
              iconRight={false}
            />
          </Row>
        }
      >
        <>
          <List
            className="bodyBold white-text"
            columns={columns}
            dataSource={meetupList}
            sticky
            onChange={handleTableChange}
            pagination={customPagination}
            showSorterTooltip={false}
            expandable={{
              expandedRowRender: record => (
                <>
                  <Row>
                    <div
                      className="bodyBold"
                      style={{ width: '200px', marginBottom: '5px' }}
                    >
                      VC Link
                    </div>
                    <div>{record.meetingLink}</div>
                  </Row>
                  <Row>
                    <div
                      className="bodyBold"
                      style={{ width: '200px', marginBottom: '5px' }}
                    >
                      Recording Link
                    </div>
                    <div>{record.recordingLink}</div>
                  </Row>
                  <Row wrap={false}>
                    <div
                      className="bodyBold"
                      style={{ width: '200px', minWidth: '200px' }}
                    >
                      Additional Details
                    </div>
                    <p
                      style={{
                        marginBottom: '5px',
                        whiteSpace: 'pre-line',
                        wordWrap: 'break-word',
                      }}
                    >
                      {record.additionalDetails}
                    </p>
                  </Row>
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
            }}
          />
        </>
      </AdminNavigationWrapperComponent>
    </div>
  );
}

MeetupListPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  meetupListPage: makeSelectMeetupListPage(),
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
)(MeetupListPage);
