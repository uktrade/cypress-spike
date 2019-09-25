const {
  transformToDnbCompanyInvestigationApi,
} = require('~/src/apps/companies/apps/add-company/transformers')

describe('Companies add company transformers', () => {
  describe('#transformToDnbCompanyInvestigationApi', () => {
    context('when all fields are populated', () => {
      let actual

      beforeEach(() => {
        actual = transformToDnbCompanyInvestigationApi({
          business_type: '1',
          name: 'name',
          website: 'website',
          telephone_number: '123',
          address1: 'line 1',
          address2: 'line 2',
          city: 'town',
          county: 'county',
          postcode: 'postcode',
          country: 'country',
          uk_region: '2',
          sector: '3',
        })
      })

      it('should transform the request body', () => {
        expect(actual).to.deep.equal({
          address: {
            country: {
              id: 'country',
            },
            county: 'county',
            line_1: 'line 1',
            line_2: 'line 2',
            postcode: 'postcode',
            town: 'town',
          },
          business_type: '1',
          name: 'name',
          sector: '3',
          telephone_number: '123',
          uk_region: '2',
          website: 'website',
        })
      })
    })

    context('when address line 2 and county are null', () => {
      let actual

      beforeEach(() => {
        actual = transformToDnbCompanyInvestigationApi({
          business_type: '1',
          name: 'name',
          website: 'website',
          telephone_number: '123',
          address1: 'line 1',
          address2: null,
          city: 'town',
          county: null,
          postcode: 'postcode',
          country: 'country',
          uk_region: '2',
          sector: '3',
        })
      })

      it('should transform the request body with empty strings', () => {
        expect(actual).to.deep.equal({
          address: {
            country: {
              id: 'country',
            },
            county: '',
            line_1: 'line 1',
            line_2: '',
            postcode: 'postcode',
            town: 'town',
          },
          business_type: '1',
          name: 'name',
          sector: '3',
          telephone_number: '123',
          uk_region: '2',
          website: 'website',
        })
      })
    })
  })
})
