import React from 'react';
import nock from 'nock';
import { cache } from 'swr';
import {
    fireEvent, render, screen, waitForElementToBeRemoved,
} from '@testing-library/react';

import vehicleFixture from '__fixtures__/vehicle';
import { vehicleRecordsPath } from 'queries/records';
import recordFixure from '__fixtures__/record';
import VehicleService from '.';

describe('VehicleService', () => {
    beforeEach(() => {
        cache.clear();

        nock(/localhost/)
            .get(/\/api\/vehicles\/\w+/)
            .reply(200, vehicleFixture);

        nock(/localhost/)
            .get(vehicleRecordsPath('123'))
            .reply(200, [recordFixure, { ...recordFixure, id: 2223, notes: 'Other note' }]);
    });

    it('renders', () => {
        expect(() => render(<VehicleService vehicleId="123" />)).not.toThrow();
    });

    it('renders records skeleton when loading', () => {
        render(<VehicleService vehicleId="123" />);
        expect(screen.getByTestId('SkeletonVehicleRecordsTable')).toBeInTheDocument();
    });

    it('renders records when fully loaded', async () => {
        nock(/localhost/)
            .get(vehicleRecordsPath('123'))
            .reply(200, [recordFixure]);

        render(<VehicleService vehicleId="123" />);

        const recordRow = await screen.findByText('Record Fixture');
        const loading = screen.queryByTestId('SkeletonVehicleRecordsTable');
        const empty = screen.queryByText('You don\'t have any records yet');
        const searchEmpty = screen.queryByText('No results');

        expect(loading).not.toBeInTheDocument();
        expect(empty).not.toBeInTheDocument();
        expect(searchEmpty).not.toBeInTheDocument();

        expect(recordRow).toBeInTheDocument();
    });

    it('renders empty state when not loading and no records', async () => {
        render(<VehicleService vehicleId="789" />);

        const empty = await screen.findByText('You don\'t have any records yet');
        const recordsTable = screen.queryByText('NOTES');
        const loading = screen.queryByTestId('SkeletonVehicleRecordsTable');
        const searchEmpty = screen.queryByText('No results');

        expect(recordsTable).not.toBeInTheDocument();
        expect(loading).not.toBeInTheDocument();
        expect(searchEmpty).not.toBeInTheDocument();

        expect(empty).toBeInTheDocument();
    });

    it('renders search results', async () => {
        render(<VehicleService vehicleId="123" />);

        await waitForElementToBeRemoved(() => screen.getByTestId('SkeletonVehicleRecordsTable'));

        const input = screen.getByPlaceholderText('Search records');
        fireEvent.change(input, {
            target: {
                value: 'oth',
            },
        });

        expect(screen.queryByText('Record Fixture')).not.toBeInTheDocument();
        expect(screen.queryByText('Other note')).toBeInTheDocument();
    });

    it('renders no results empty state when no search results', async () => {
        render(<VehicleService vehicleId="123" />);

        await waitForElementToBeRemoved(() => screen.getByTestId('SkeletonVehicleRecordsTable'));

        const input = screen.getByPlaceholderText('Search records');
        fireEvent.change(input, {
            target: {
                value: 'nope',
            },
        });

        expect(screen.queryByText('Record Fixture')).not.toBeInTheDocument();
        expect(screen.queryByText('Other note')).not.toBeInTheDocument();

        expect(screen.getByText('Try searching a date or note')).toBeInTheDocument();
    });
});
