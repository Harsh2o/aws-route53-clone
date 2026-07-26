'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Table from '@cloudscape-design/components/table';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import Modal from '@cloudscape-design/components/modal';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Textarea from '@cloudscape-design/components/textarea';
import Select from '@cloudscape-design/components/select';
import Flashbar from '@cloudscape-design/components/flashbar';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Icon from '@cloudscape-design/components/icon';
import { useParams } from 'next/navigation';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { HostedZone, DNSRecord, PaginatedResponse } from '@/types/api';
import { AwsShell } from '@/components/aws-shell';

const RECORD_TYPES = [
  { label: 'A - IPv4 address', value: 'A' },
  { label: 'AAAA - IPv6 address', value: 'AAAA' },
  { label: 'CNAME - Canonical name', value: 'CNAME' },
  { label: 'MX - Mail exchange', value: 'MX' },
  { label: 'TXT - Text', value: 'TXT' },
  { label: 'PTR - Pointer', value: 'PTR' },
  { label: 'SRV - Service locator', value: 'SRV' },
  { label: 'NS - Name server', value: 'NS' },
  { label: 'CAA - Certification Authority Authorization', value: 'CAA' },
];

export default function HostedZoneDetailsPage() {
  const { id } = useParams() as { id: string };
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [selectedItems, setSelectedItems] = useState<DNSRecord[]>([]);
  const [flashMessages, setFlashMessages] = useState<any[]>([]);

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DNSRecord | null>(null);

  // Form state
  const [recordName, setRecordName] = useState('');
  const [recordType, setRecordType] = useState<{label?: string, value?: string} | null>(RECORD_TYPES[0]);
  const [recordValue, setRecordValue] = useState('');
  const [recordTtl, setRecordTtl] = useState('300');
  
  // Dynamic fields based on type
  const [recordPriority, setRecordPriority] = useState('');
  const [recordWeight, setRecordWeight] = useState('');
  const [recordPort, setRecordPort] = useState('');
  const [recordTarget, setRecordTarget] = useState('');
  const [recordFlags, setRecordFlags] = useState('0');
  const [recordTag, setRecordTag] = useState<{label?: string, value?: string} | null>({ label: 'issue', value: 'issue' });

  // Fetch zone details
  const { data: zone, isLoading: isZoneLoading } = useQuery({
    queryKey: ['hosted-zones', id],
    queryFn: () => apiGet<HostedZone>(`/api/v1/hosted-zones/${id}`),
  });

  // Fetch records
  const fetchRecords = async (page: number, search: string) => {
    const data = await apiGet<PaginatedResponse<DNSRecord>>(`/api/v1/hosted-zones/${id}/records?page=${page}&size=${pageSize}&search=${encodeURIComponent(search)}`);
    return data;
  };

  const { data: recordsData, isLoading: isRecordsLoading } = useQuery({
    queryKey: ['records', id, currentPage, searchValue],
    queryFn: () => fetchRecords(currentPage, searchValue),
    enabled: !!id,
  });

  const saveMutation = useMutation({
    mutationFn: (payload: any) => {
      if (editingRecord) {
        return apiPut<DNSRecord>(`/api/v1/hosted-zones/${id}/records/${editingRecord.id}`, payload);
      } else {
        return apiPost<DNSRecord>(`/api/v1/hosted-zones/${id}/records`, payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records', id] });
      queryClient.invalidateQueries({ queryKey: ['hosted-zones', id] });
      setIsRecordModalOpen(false);
      setFlashMessages([{
        type: 'success',
        content: `Record ${editingRecord ? 'updated' : 'created'} successfully.`,
        dismissible: true,
        onDismiss: () => setFlashMessages([]),
      }]);
    },
    onError: (err: any) => {
      setFlashMessages([{
        type: 'error',
        content: `Failed to save record: ${err.message}`,
        dismissible: true,
        onDismiss: () => setFlashMessages([]),
      }]);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (recordId: string) => {
      return apiDelete(`/api/v1/hosted-zones/${id}/records/${recordId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records', id] });
      queryClient.invalidateQueries({ queryKey: ['hosted-zones', id] });
      setIsDeleteModalOpen(false);
      setSelectedItems([]);
      setFlashMessages([{
        type: 'success',
        content: 'Record deleted successfully.',
        dismissible: true,
        onDismiss: () => setFlashMessages([]),
      }]);
    },
    onError: (err: any) => {
      setFlashMessages([{
        type: 'error',
        content: `Failed to delete record: ${err.message}`,
        dismissible: true,
        onDismiss: () => setFlashMessages([]),
      }]);
    }
  });

  const openCreateModal = () => {
    setEditingRecord(null);
    setRecordName('');
    setRecordType(RECORD_TYPES[0]);
    setRecordValue('');
    setRecordTtl('300');
    setRecordPriority('');
    setRecordWeight('');
    setRecordPort('');
    setRecordTarget('');
    setRecordFlags('0');
    setRecordTag({ label: 'issue', value: 'issue' });
    setIsRecordModalOpen(true);
  };

  const openEditModal = () => {
    if (selectedItems.length === 0) return;
    const item = selectedItems[0];
    setEditingRecord(item);
    
    // Split name format usually ends with domain
    let localName = item.name;
    if (zone && localName === zone.name) localName = '';
    else if (zone && localName.endsWith('.' + zone.name)) {
      localName = localName.substring(0, localName.length - zone.name.length - 1);
    }
    
    setRecordName(localName);
    const typeObj = RECORD_TYPES.find(t => t.value === item.type) || { label: item.type, value: item.type };
    setRecordType(typeObj);
    setRecordValue(item.value);
    setRecordTtl(item.ttl.toString());
    setRecordPriority(item.priority?.toString() || '');
    setRecordWeight(item.weight?.toString() || '');
    setRecordPort(item.port?.toString() || '');
    setRecordTarget(item.target || '');
    setRecordFlags(item.flags?.toString() || '0');
    if (item.tag) {
      setRecordTag({ label: item.tag, value: item.tag });
    }
    
    setIsRecordModalOpen(true);
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      name: recordName,
      type: recordType?.value || 'A',
      ttl: parseInt(recordTtl, 10),
      value: recordValue,
    };

    if (payload.type === 'MX' || payload.type === 'SRV') {
      payload.priority = parseInt(recordPriority, 10) || 0;
    }
    if (payload.type === 'SRV') {
      payload.weight = parseInt(recordWeight, 10) || 0;
      payload.port = parseInt(recordPort, 10) || 0;
      payload.target = recordTarget;
    }
    if (payload.type === 'CAA') {
      payload.flags = parseInt(recordFlags, 10) || 0;
      payload.tag = recordTag?.value;
    }

    saveMutation.mutate(payload);
  };

  const handleDeleteConfirm = async () => {
    if (selectedItems.length > 0) {
      try {
        await Promise.all(selectedItems.map(item => deleteMutation.mutateAsync(item.id)));
      } catch (err) {
        // Errors are handled by the mutation onError
      }
    }
  };

  const { items, collectionProps } = useCollection(recordsData?.items || [], {
    pagination: {},
    selection: {},
  });

  const isSystemRecordSelected = selectedItems.length > 0 && selectedItems[0].system;

  if (!mounted) {
    return null; // Prevent SSR hydration errors for complex Cloudscape components
  }

  return (
    <AwsShell 
      breadcrumbs={[
        { text: 'Route 53', href: '/' }, 
        { text: 'Hosted zones', href: '/hosted-zones' },
        { text: zone?.name || id, href: `/hosted-zones/${id}` }
      ]}
    >
      <SpaceBetween size="l">
        {flashMessages.length > 0 && <Flashbar items={flashMessages} />}
        
        {zone && (
          <Container header={<Header variant="h2">Hosted zone details</Header>}>
            <ColumnLayout columns={4} variant="text-grid">
              <div>
                <Box variant="awsui-key-label">Hosted zone ID</Box>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                  <span>{zone.aws_zone_id || `/hostedzone/Z${zone.id}ABC`}</span>
                  <Button 
                    variant="inline-icon" 
                    iconName="copy" 
                    onClick={() => navigator.clipboard.writeText(zone.aws_zone_id || `/hostedzone/Z${zone.id}ABC`)} 
                    ariaLabel="Copy Hosted zone ID" 
                  />
                </div>
              </div>
              <div>
                <Box variant="awsui-key-label">Type</Box>
                <div>{zone.type}</div>
              </div>
              <div>
                <Box variant="awsui-key-label">Record count</Box>
                <div>{zone.record_count}</div>
              </div>
              <div>
                <Box variant="awsui-key-label">Description</Box>
                <div>{zone.description || '-'}</div>
              </div>
            </ColumnLayout>
          </Container>
        )}

        <Table
          {...collectionProps}
          trackBy="id"
          selectedItems={selectedItems}
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems as DNSRecord[])}
          selectionType="multi"
          columnDefinitions={[
            {
              id: 'name',
              header: 'Record name',
              cell: item => (
                <SpaceBetween direction="horizontal" size="xs">
                  {item.system ? <Icon key="icon" name="lock-private" variant="subtle" /> : null}
                  <span key="text">{item.name}</span>
                </SpaceBetween>
              ),
              isRowHeader: true,
            },
            {
              id: 'type',
              header: 'Type',
              cell: item => item.type,
            },
            {
              id: 'routing_policy',
              header: 'Routing policy',
              cell: item => item.routing_policy || 'Simple',
            },
            {
              id: 'ttl',
              header: 'TTL',
              cell: item => item.ttl,
            },
            {
              id: 'value',
              header: 'Value',
              cell: item => {
                let v = item.value;
                if (item.type === 'MX' && item.priority !== undefined) {
                  v = `${item.priority} ${v}`;
                }
                if (item.type === 'SRV' && item.priority !== undefined) {
                  v = `${item.priority} ${item.weight} ${item.port} ${item.target}`;
                }
                if (item.type === 'CAA' && item.flags !== undefined) {
                  v = `${item.flags} ${item.tag} "${v}"`;
                }
                // Truncate if long
                return v.length > 50 ? v.substring(0, 50) + '...' : v;
              },
            },
          ]}
          items={items}
          loading={isRecordsLoading}
          loadingText="Loading records..."
          empty={
            <div style={{ textAlign: 'center' }}>
              <b>No records</b>
              <p>You don't have any records in this hosted zone.</p>
              <Button onClick={openCreateModal}>Create record</Button>
            </div>
          }
          header={
            <Header
              variant="h1"
              description="DNS records for this hosted zone."
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button 
                    disabled={selectedItems.length === 0 || isSystemRecordSelected} 
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Delete
                  </Button>
                  <Button 
                    disabled={selectedItems.length === 0 || isSystemRecordSelected}
                    onClick={openEditModal}
                  >
                    Edit record
                  </Button>
                  <Button variant="primary" onClick={openCreateModal}>
                    Create record
                  </Button>
                </SpaceBetween>
              }
              counter={recordsData ? `(${recordsData.total})` : undefined}
            >
              Records
            </Header>
          }
          filter={
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <TextFilter
                  filteringPlaceholder="Search by record name"
                  filteringText={searchValue}
                  onChange={({ detail }) => setSearchValue(detail.filteringText)}
                />
              </div>
              <div style={{ width: '200px' }}>
                <Select
                  selectedOption={null}
                  onChange={() => {}}
                  options={[{ label: 'All types', value: '' }, ...RECORD_TYPES]}
                  placeholder="Record type"
                />
              </div>
            </div>
          }
          pagination={
            <Pagination
              currentPageIndex={currentPage}
              onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
              openEnd={recordsData ? recordsData.page * recordsData.size < recordsData.total : false}
              pagesCount={recordsData ? Math.ceil(recordsData.total / recordsData.size) : 0}
            />
          }
        />
      </SpaceBetween>

      {mounted && (
        <Modal
          onDismiss={() => setIsRecordModalOpen(false)}
          visible={isRecordModalOpen}
          closeAriaLabel="Close modal"
          header={editingRecord ? "Edit record" : "Quick create record"}
          size="medium"
        >
          <form onSubmit={handleSaveRecord}>
            <Form
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button formAction="none" variant="link" onClick={() => setIsRecordModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" loading={saveMutation.isPending}>
                    {editingRecord ? "Save changes" : "Create records"}
                  </Button>
                </SpaceBetween>
              }
            >
              <SpaceBetween size="l">
                <FormField 
                  label="Record name" 
                  description={`Enter a name. If blank, it applies to the apex domain (${zone?.name}).`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Input
                      value={recordName}
                      onChange={({ detail }) => setRecordName(detail.value)}
                      placeholder="subdomain"
                    />
                    <span style={{ color: '#687078' }}>.{zone?.name}</span>
                  </div>
                </FormField>

                <FormField label="Record type" description="Choose the DNS record type.">
                  <Select
                    selectedOption={recordType}
                    onChange={({ detail }) => setRecordType(detail.selectedOption)}
                    options={RECORD_TYPES}
                  />
                </FormField>

                {/* Dynamic fields based on recordType */}
                {recordType?.value === 'MX' && (
                  <FormField label="Priority" description="Lower number means higher priority.">
                    <Input
                      type="number"
                      value={recordPriority}
                      onChange={({ detail }) => setRecordPriority(detail.value)}
                    />
                  </FormField>
                )}

                {recordType?.value === 'SRV' && (
                  <ColumnLayout columns={3}>
                    <FormField label="Priority">
                      <Input type="number" value={recordPriority} onChange={({ detail }) => setRecordPriority(detail.value)} />
                    </FormField>
                    <FormField label="Weight">
                      <Input type="number" value={recordWeight} onChange={({ detail }) => setRecordWeight(detail.value)} />
                    </FormField>
                    <FormField label="Port">
                      <Input type="number" value={recordPort} onChange={({ detail }) => setRecordPort(detail.value)} />
                    </FormField>
                  </ColumnLayout>
                )}

                {recordType?.value === 'SRV' ? (
                  <FormField label="Target">
                    <Input value={recordTarget} onChange={({ detail }) => setRecordTarget(detail.value)} />
                  </FormField>
                ) : recordType?.value === 'CAA' ? (
                  <ColumnLayout columns={3}>
                    <FormField label="Flags">
                      <Input type="number" value={recordFlags} onChange={({ detail }) => setRecordFlags(detail.value)} />
                    </FormField>
                    <FormField label="Tag">
                      <Select
                        selectedOption={recordTag}
                        onChange={({ detail }) => setRecordTag(detail.selectedOption)}
                        options={[{ label: 'issue', value: 'issue' }, { label: 'issuewild', value: 'issuewild' }, { label: 'iodef', value: 'iodef' }]}
                      />
                    </FormField>
                    <FormField label="Value">
                      <Input value={recordValue} onChange={({ detail }) => setRecordValue(detail.value)} />
                    </FormField>
                  </ColumnLayout>
                ) : (
                  <FormField 
                    label={
                      recordType?.value === 'A' ? 'IPv4 address' :
                      recordType?.value === 'AAAA' ? 'IPv6 address' :
                      (recordType?.value === 'CNAME' || recordType?.value === 'PTR') ? 'Target domain' :
                      recordType?.value === 'NS' ? 'Name server' :
                      'Value'
                    } 
                    description={
                      recordType?.value === 'A' ? 'Enter an IPv4 address.' :
                      recordType?.value === 'AAAA' ? 'Enter an IPv6 address.' :
                      'Enter the record value.'
                    }
                    errorText={
                      (recordValue && recordType?.value === 'A' && !/^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(recordValue)) ? "Invalid IPv4 address format." :
                      (recordValue && recordType?.value === 'AAAA' && !/^[0-9a-fA-F:]+$/.test(recordValue)) ? "Invalid IPv6 address format." :
                      undefined
                    }
                  >
                    <Textarea
                      value={recordValue}
                      onChange={({ detail }) => setRecordValue(detail.value)}
                      rows={3}
                    />
                  </FormField>
                )}

                <FormField label="TTL (Seconds)" description="Time to live">
                  <Input
                    type="number"
                    value={recordTtl}
                    onChange={({ detail }) => setRecordTtl(detail.value)}
                  />
                </FormField>
              </SpaceBetween>
            </Form>
          </form>
        </Modal>
      )}

      {mounted && (
        <Modal
          onDismiss={() => setIsDeleteModalOpen(false)}
          visible={isDeleteModalOpen}
          closeAriaLabel="Close modal"
          header="Delete record"
          footer={
            <SpaceBetween direction="horizontal" size="xs" className="awsui-util-float-right">
              <Button variant="link" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleDeleteConfirm} loading={deleteMutation.isPending}>Delete</Button>
            </SpaceBetween>
          }
        >
          Are you sure you want to delete {selectedItems.length === 1 ? (
            <>the record <strong>{selectedItems[0]?.name}</strong></>
          ) : (
            <>these <strong>{selectedItems.length}</strong> records</>
          )}?
        </Modal>
      )}
    </AwsShell>
  );
}
