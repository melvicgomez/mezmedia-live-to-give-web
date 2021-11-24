/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/**
 *
 * PollListPage
 *
 */

import React, { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// import { push } from 'connected-react-router';
import { connect } from 'react-redux';
// import axiosInstance from 'services';
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
// import ConfirmationPopupComponent from 'components/ConfirmationPopupComponent';
import AdminNavigationWrapperComponent from 'components/admin/AdminNavigationWrapperComponent';
import PrimaryButtonComponent from 'components/PrimaryButtonComponent';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectPollListController from './selectors';
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

export function PollListPage({ match, dispatch }) {
  useInjectReducer({ key: 'pollListPage', reducer });
  useInjectSaga({ key: 'pollListPage', saga });

  const [postList, setPostList] = useState([]);
  const [customPagination, setCustomPagination] = useState({
    current: 1,
    pageSize: 200,
    showSizeChanger: false,
    simple: true,
  });
  const [selectedSorter, setSelectedSorter] = useState({
    columnKey: 'feed_id',
    order: 'descend',
  });
  const [keyword, setKeyword] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(1);

  // const [selectedFeed, setSelectedFeed] = useState(null);
  // const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // for clean up unmount
  const unmounted = useRef(false);

  const columns = [
    {
      title: 'Poll ID',
      dataIndex: 'pollId',
      align: 'center',
      key: 'pollId',
      render: text => (
        <a className="white-text" href={`/admin/polls/${text}`}>
          {text}
        </a>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: text => (
        <div
          className={
            text.startsWith('Scheduled at')
              ? 'orange-text'
              : text === 'Unpublished' || text === 'Ended'
              ? 'error-text'
              : 'green-text'
          }
        >
          {text}
        </div>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 200,
      key: 'title',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 130,
      render: image => <DisplayImage image={image} />,
    },
    {
      title: '#Response',
      dataIndex: 'response',
      key: 'response',
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
    let api = `api/admin/all-polls?page=${page}&search=${
      !!search && keyword.trim().length ? search : ''
    }`;

    if (sorter) {
      api += `&order_by=${
        sorter.columnKey === 'postedDate' ? 'published_at' : 'feed_id'
      }&sort_by=${sorter.order === 'ascend' ? 'asc' : 'desc'}`;
    }

    axiosInstance.get(api).then(res => {
      if (!unmounted.current) {
        setSelectedFilter(filter);
        const details = res.data.data;
        const newList = details.map(d => ({
          key: d.poll_id,
          pollId: d.poll_id,
          status: d.published_at
            ? moment.utc() >= moment.utc(d.ended_at)
              ? 'Ended'
              : moment.utc() < moment.utc(d.started_at)
              ? `Scheduled at ${moment
                  .utc(d.started_at)
                  .local()
                  .format('DD/MM/yyyy HH:mm')}`
              : moment
                  .utc(d.started_at)
                  .local()
                  .format('DD/MM/yyyy HH:mm')
            : 'Unpublished',
          title: d.title,
          response: d.responses_count,
          image: d.image_cover ? [d.poll_id, d.image_cover] : [],
          options: [d.option_one, d.option_two, d.option_three, d.option_four],
          startDate: moment
            .utc(d.started_at)
            .local()
            .format('DD/MM/yyyy HH:mm'),
          endDate: moment
            .utc(d.ended_at)
            .local()
            .format('DD/MM/yyyy HH:mm'),
        }));
        setPostList(newList);

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

  const DisplayImage = ({ image }) => {
    const [imgError, setImgError] = useState(false);

    return image.length && !imgError ? (
      <img
        src={`${process.env.IMAGE_URL_PREFIX}poll/${image[0]}/${image[1]}`}
        style={{
          height: '63px',
          width: '90px',
          objectFit: 'cover',
          backgroundColor: Colors.bodyText,
        }}
        alt="post"
        onError={() => setImgError(true)}
      />
    ) : (
      <div className="white-text">-</div>
    );
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
            <PrimaryButtonComponent
              style={{
                padding: '0px 20px',
                marginiRght: '10px',
                marginTop: '5px',
                display: 'flex',
                justifyContent: 'center',
              }}
              label="Create"
              onClick={() => dispatch(push('../../admin/poll/create'))}
              iconRight={false}
            />
          </Row>
        }
      >
        <List
          className="bodyBold white-text"
          columns={columns}
          dataSource={postList}
          sticky
          onChange={handleTableChange}
          pagination={customPagination}
          showSorterTooltip={false}
          expandable={{
            expandedRowRender: record => (
              <div>
                <div className="bodyLink">Options:</div>
                <ol>
                  {record.options.map((option, index) => (
                    <li key={index} style={{ marginTop: 5 }}>
                      {option}
                    </li>
                  ))}
                </ol>
              </div>
            ),
          }}
        />
      </AdminNavigationWrapperComponent>
    </div>
  );
}

PollListPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  pollListPage: makeSelectPollListController(),
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
)(PollListPage);
