import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Avatar, InputNumber, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { teamService, TeamMemberItem } from '../../services/teamService';
import { TableSkeleton } from '../../components/Common/LoadingSkeleton';

const { Title } = Typography;

export const TeamList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [orderChanges, setOrderChanges] = useState<{ [id: string]: number }>({});
  const [savingOrder, setSavingOrder] = useState(false);

  const navigate = useNavigate();

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await teamService.getTeam();
      if (res.success) {
        setTeam(res.teamMembers);
        // Reset local changes
        setOrderChanges({});
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to load team roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await teamService.deleteMember(id);
      if (res.success) {
        message.success('Team member profile deleted.');
        fetchTeam();
      }
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || 'Failed to delete member.');
    }
  };

  const handleOrderChange = (id: string, val: number | null) => {
    if (val === null) return;
    setOrderChanges(prev => ({
      ...prev,
      [id]: val
    }));
  };

  const saveOrderReindexing = async () => {
    const payloads = Object.keys(orderChanges).map(id => ({
      id,
      order_index: orderChanges[id]
    }));

    if (payloads.length === 0) return;

    setSavingOrder(true);
    try {
      const res = await teamService.reorderTeam(payloads);
      if (res.success) {
        message.success('Team member indexes saved successfully!');
        fetchTeam();
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to save team sorting indices.');
    } finally {
      setSavingOrder(false);
    }
  };

  const columns = [
    {
      title: 'Order Index',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      width: '15%',
      sorter: (a: TeamMemberItem, b: TeamMemberItem) => a.orderIndex - b.orderIndex,
      render: (index: number, record: TeamMemberItem) => (
        <InputNumber
          min={0}
          value={orderChanges[record.id] !== undefined ? orderChanges[record.id] : index}
          onChange={(val) => handleOrderChange(record.id, val)}
          style={{ width: 70 }}
        />
      )
    },
    {
      title: 'Member',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: TeamMemberItem) => (
        <Space>
          <Avatar src={record.profileImageUrl} size="large" />
          <Space direction="vertical" size={0}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{text}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{record.contact || 'No contact'}</span>
          </Space>
        </Space>
      )
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (text: string, record: TeamMemberItem) => (
        <Space direction="vertical" size={0}>
          <span style={{ color: 'var(--text-main)' }}>{text}</span>
          {record.affiliation && <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{record.affiliation}</span>}
        </Space>
      )
    },
    {
      title: 'LinkedIn',
      dataIndex: 'linkedinUrl',
      key: 'linkedinUrl',
      render: (url?: string) => (
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#00B5E2', textDecoration: 'underline' }}>
            Profile Link
          </a>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>N/A</span>
        )
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: TeamMemberItem) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/team/edit/${record.id}`)}
            style={{ color: '#00629B' }}
          />
          <Popconfirm
            title="Are you sure you want to remove this team member?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  if (loading && team.length === 0) {
    return <TableSkeleton />;
  }

  const hasOrderChanges = Object.keys(orderChanges).length > 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>
          Team Roster
        </Title>
        <Space>
          {hasOrderChanges && (
            <Button
              icon={<SaveOutlined />}
              onClick={saveOrderReindexing}
              loading={savingOrder}
              style={{ background: '#2ec4b6', border: 'none', color: '#FFF' }}
            >
              Save Order
            </Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/team/new')}
            style={{ background: '#00629B', border: 'none', height: '40px', fontWeight: 600 }}
          >
            Add Team Member
          </Button>
        </Space>
      </div>

      <Table
        dataSource={team}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
        style={{ background: 'var(--bg-surface)', borderRadius: '8px', overflow: 'hidden' }}
      />
    </div>
  );
};
