'use client'

import { Card, Statistic, Row, Col, Divider, Typography, Empty } from 'antd';
import { BookOutlined, TeamOutlined, StarOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CoursesDashboard = () => {
  // Dữ liệu mẫu (có thể lấy từ API hoặc state)
  const stats = {
    courses: 0,
    groups: 0,
    ratings: 0,
    points: 0,
  };

  const courseStatus = {
    all: 0,
    completed: 0,
    inProgress: 0,
    failed: 0,
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Các khóa học đã đăng ký</Title>
        <Text type="secondary">Ấn Thông kê</Text>
      </div>

      {/* Thống kê tổng quan */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Gói Khóa Học"
              value={stats.courses}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Nhóm"
              value={stats.groups}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đánh giá"
              value={stats.ratings}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Điểm"
              value={stats.points}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Trạng thái khóa học */}
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#e6f7ff', borderRadius: '8px' }}>
            <Statistic
              title="Tất cả"
              value={courseStatus.all}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#f6ffed', borderRadius: '8px' }}>
            <Statistic
              title="Hoàn thành"
              value={courseStatus.completed}
              prefix={<BookOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#fff7e6', borderRadius: '8px' }}>
            <Statistic
              title="Đang tiến hành"
              value={courseStatus.inProgress}
              prefix={<BookOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ background: '#fff1f0', borderRadius: '8px' }}>
            <Statistic
              title="Thất bại"
              value={courseStatus.failed}
              prefix={<BookOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Thông báo nếu chưa đăng ký khóa học */}
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <Empty
          image={<BookOutlined style={{ fontSize: '48px', color: '#1890ff' }} />}
          description={<Text style={{ color: '#1890ff' }}>Bạn chưa đăng ký khóa học nào.</Text>}
        />
      </div>
    </div>
  );
};

export default CoursesDashboard;