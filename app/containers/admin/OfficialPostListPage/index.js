/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * OfficialPostListPage
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
import makeSelectOfficialPostListPage from './selectors';
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

export function OfficialPostListPage({ match, dispatch }) {
  useInjectReducer({ key: 'OfficialPostListPage', reducer });
  useInjectSaga({ key: 'OfficialPostListPage', saga });

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
      title: 'Feed ID',
      dataIndex: 'feedId',
      align: 'center',
      key: 'feedId',
      render: text => (
        <a className="white-text" href={`/admin/officials/${text}`}>
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
        <div
          className={
            text.startsWith('Scheduled at')
              ? 'orange-text'
              : text === 'Unpublished'
              ? 'error-text'
              : 'green-text'
          }
        >
          {text}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 140,
      key: 'type',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 200,
      key: 'title',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      render: text => <div className="white-text fix-line">{text}</div>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 130,
      render: image => <DisplayImage image={image} />,
    },
    {
      title: 'Pinned',
      dataIndex: 'pinned',
      align: 'center',
      key: 'pinned',
    },
  ];

  useEffect(() => {
    getList(1);

    return () => {
      unmounted.current = true;
    };
  }, []);

  const getList = (page, search = '', filter = 1, sorter = null) => {
    let api = `api/admin/all-officials?page=${page}&search=${
      !!search && keyword.trim().length ? search : ''
    }&show_status=${
      filter === 1 ? 'all' : filter === 2 ? 'official' : 'announcement'
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
          key: d.feed_id,
          feedId: d.feed_id,
          postedDate: d.scheduled_at
            ? `Scheduled at ${moment(d.scheduled_at).format(
                'DD/MM/yyyy HH:mm',
              )}`
            : d.published_at
            ? moment
                .utc(d.published_at)
                .local()
                .format('DD/MM/yyyy HH:mm')
            : 'Unpublished',
          type: d.feed_type.charAt(0).toUpperCase() + d.feed_type.slice(1),
          title: d.title,
          content: d.content,
          image: d.images.length ? [d.feed_id, d.images[0].image_path] : [],
          pinned: d.pin_post ? 'Yes' : 'No',
          htmlContent: d.html_content,
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
        src={`${process.env.IMAGE_URL_PREFIX}activity-feed/${image[0]}/${
          image[1]
        }`}
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
                  Show Official
                </div>
                <div
                  className={selectedFilter === 3 ? 'cyan-text' : 'white-text'}
                  onClick={() => getList(1, keyword, 3, null)}
                >
                  Show Announcement
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
              onClick={() => dispatch(push('../../admin/official/create'))}
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
                <div className="bodyLink">HTML Content:</div>
                <p
                  style={{
                    margin: '10px 10px 5px',
                    whiteSpace: 'pre-line',
                    wordWrap: 'break-word',
                  }}
                >
                  {record.htmlContent}
                </p>
              </div>
            ),
          }}
        />
      </AdminNavigationWrapperComponent>
    </div>
  );
}

OfficialPostListPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  OfficialPostListPage: makeSelectOfficialPostListPage(),
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
)(OfficialPostListPage);
