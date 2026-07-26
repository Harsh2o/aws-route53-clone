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
import RadioGroup from '@cloudscape-design/components/radio-group';
import Select from '@cloudscape-design/components/select';
import Flashbar from '@cloudscape-design/components/flashbar';
import Link from '@cloudscape-design/components/link';
import { apiGet, apiPost, apiDelete } from '@/lib/api';
import { HostedZone, PaginatedResponse } from '@/types/api';
import { AwsShell } from '@/components/aws-shell';

export default function HostedZonesPage() {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // State for search and pagination
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Selected items state
  const [selectedItems, setSelectedItems] = useState<HostedZone[]>([]);

  // Flashbar state
  const [flashMessages, setFlashMessages] = useState<any[]>([]);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form state
  const [newZoneDomain, setNewZoneDomain] = useState('');
  const [newZoneType, setNewZoneType] = useState('Public');
  const [newZoneDescription, setNewZoneDescription] = useState('');

  const fetchZones = async (page: number, search: string) => {
    const data = await apiGet<PaginatedResponse<HostedZone>>(`/api/v1/hosted-zones?page=${page}&size=${pageSize}&search=${encodeURIComponent(search)}`);
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['hosted-zones', currentPage, searchValue],
    queryFn: () => fetchZones(currentPage, searchValue),
  });

  const createMutation = useMutation({
    mutationFn: (newZone: { name: string; type: string; description: string }) => {
      return apiPost<HostedZone>('/api/v1/hosted-zones', newZone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosted-zones'] });
      setIsCreateModalOpen(false);
      setNewZoneDomain('');
      setNewZoneDescription('');
      setFlashMessages([{
        type: 'success',
        content: 'Hosted zone created successfully.',
        dismissible: true,
        onDismiss: () => setFlashMessages([]),
      }]);
    },
    onError: (err: any) => {
      setFlashMessages([{
        type: 'error',
        content: `Failed to create hosted zone: ${err.message}`,
        dismissible: true,
        onDismiss: () => setFlashMessages([]),
      }]);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return apiDelete(`/api/v1/hosted-zones/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosted-zones'] });
      setIsDeleteModalOpen(false);
      setSelectedItems([]);
      setFlashMessages([{
        type: 'success',
        content: 'Hosted zone deleted successfully.',
        dismissible: true,
        onDismiss: () => setFlashMessages([]),
      }]);
    },
    onError: (err: any) => {
      setFlashMessages([{
        type: 'error',
        content: `Failed to delete hosted zone: ${err.message}`,
        dismissible: true,
        onDismiss: () => setFlashMessages([]),
      }]);
    }
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: newZoneDomain,
      type: newZoneType,
      description: newZoneDescription,
    });
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

  const { items, collectionProps, paginationProps } = useCollection(data?.items || [], {
    pagination: {},
    selection: {},
  });

  if (!mounted) {
    return null;
  }

  return (
    <AwsShell breadcrumbs={[{ text: 'Route 53', href: '/' }, { text: 'Hosted zones', href: '/hosted-zones' }]}>
      <SpaceBetween size="l">
        {flashMessages.length > 0 && <Flashbar items={flashMessages} />}
        
        <Table
          {...collectionProps}
          trackBy="id"
          selectedItems={selectedItems}
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems as HostedZone[])}
          selectionType="multi"
          columnDefinitions={[
            {
              id: 'name',
              header: 'Hosted zone name',
              cell: item => <Link href={`/hosted-zones/${item.id}`}>{item.name}</Link>,
              isRowHeader: true,
            },
            {
              id: 'type',
              header: 'Type',
              cell: item => item.type,
            },
            {
              id: 'record_count',
              header: 'Record count',
              cell: item => item.record_count,
            },
            {
              id: 'description',
              header: 'Description',
              cell: item => item.description || '-',
            },
          ]}
          items={items}
          loading={isLoading}
          loadingText="Loading hosted zones..."
          empty={
            <div style={{ textAlign: 'center' }}>
              <b>No hosted zones</b>
              <p>You don't have any hosted zones yet.</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>Create hosted zone</Button>
            </div>
          }
          header={
            <Header
              variant="h1"
              description="Hosted zones are collections of records for a specified domain, like example.com."
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button disabled={selectedItems.length === 0} onClick={() => setIsDeleteModalOpen(true)}>
                    Delete
                  </Button>
                  <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                    Create hosted zone
                  </Button>
                </SpaceBetween>
              }
              counter={data ? `(${data.total})` : undefined}
            >
              Hosted zones
            </Header>
          }
          filter={
            <TextFilter
              filteringPlaceholder="Search hosted zones"
              filteringText={searchValue}
              onChange={({ detail }) => setSearchValue(detail.filteringText)}
            />
          }
          pagination={
            items.length > 0 ? (
              <Pagination
                currentPageIndex={currentPage}
                onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
                openEnd={data ? data.page * data.size < data.total : false}
                pagesCount={data ? Math.ceil(data.total / data.size) : 0}
              />
            ) : null
          }
        />
      </SpaceBetween>

      {mounted && (
        <Modal
          onDismiss={() => setIsCreateModalOpen(false)}
          visible={isCreateModalOpen}
          closeAriaLabel="Close modal"
          header="Create hosted zone"
        >
          <form onSubmit={handleCreateSubmit}>
            <Form
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button formAction="none" variant="link" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" loading={createMutation.isPending}>
                    Create hosted zone
                  </Button>
                </SpaceBetween>
              }
            >
              <SpaceBetween size="l">
                <FormField 
                  label="Domain name" 
                  description="Enter the domain name for your hosted zone."
                  errorText={
                    newZoneDomain && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newZoneDomain) 
                      ? "Invalid domain name format." 
                      : undefined
                  }
                >
                  <Input
                    value={newZoneDomain}
                    onChange={({ detail }) => setNewZoneDomain(detail.value)}
                    placeholder="example.com"
                  />
                </FormField>
                <FormField label="Type" description="Choose Public or Private.">
                  <RadioGroup
                    value={newZoneType}
                    onChange={({ detail }) => setNewZoneType(detail.value)}
                    items={[
                      { value: 'Public', label: 'Public hosted zone', description: 'Routes traffic on the internet' },
                      { value: 'Private', label: 'Private hosted zone', description: 'Routes traffic within Amazon VPCs' },
                    ]}
                  />
                </FormField>
                
                {newZoneType === 'Private' && (
                  <>
                    <FormField label="Region" description="The region that you want to associate with the VPC.">
                      <Select
                        selectedOption={{ label: 'US East (N. Virginia)', value: 'us-east-1' }}
                        onChange={() => {}}
                        options={[{ label: 'US East (N. Virginia)', value: 'us-east-1' }]}
                      />
                    </FormField>
                    <FormField label="VPC ID" description="The ID of a VPC that you want to associate with this hosted zone.">
                      <Select
                        selectedOption={{ label: 'vpc-0123456789abcdef', value: 'vpc-0123456789abcdef' }}
                        onChange={() => {}}
                        options={[{ label: 'vpc-0123456789abcdef', value: 'vpc-0123456789abcdef' }]}
                      />
                    </FormField>
                  </>
                )}

                <FormField label="Description - optional" description="Comments or notes about the hosted zone.">
                  <Textarea
                    value={newZoneDescription}
                    onChange={({ detail }) => setNewZoneDescription(detail.value)}
                    placeholder="Enter a description"
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
          header="Delete hosted zone"
          footer={
            <SpaceBetween direction="horizontal" size="xs" className="awsui-util-float-right">
              <Button variant="link" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleDeleteConfirm} loading={deleteMutation.isPending}>Delete</Button>
            </SpaceBetween>
          }
        >
          Are you sure you want to delete {selectedItems.length === 1 ? (
            <>the hosted zone <strong>{selectedItems[0]?.name}</strong></>
          ) : (
            <>these <strong>{selectedItems.length}</strong> hosted zones</>
          )}? This action cannot be undone.
        </Modal>
      )}
    </AwsShell>
  );
}
