require 'rails_helper'

RSpec.describe 'Foo API', type: :request do
  include_context 'db_cleanup_each', :transaction

  context 'caller request a list of Foos' do
    let!(:foos) { (1..5).map { |_idx| FactoryGirl.create(:foo) } }

    it 'returns all instances' do
      get foos_path, { sample1: 'param', sample2: 'param' },
          'Accept' => 'application/json'
      expect(request.method).to eq('GET')
      expect(response.content_type).to eq('application/json')

      payload = parsed_body
      expect(payload.count).to eq(foos.count)
      expect(payload.map { |f| f['name'] }).to eq(foos.map { |f| f[:name] })
    end
  end

  context 'a specific Foo exists' do
    let(:foo) { FactoryGirl.create(:foo) }
    let(:bad_id) { 1_234_567_890 }
    it 'returns Foo when using correct ID' do
      get foo_path(foo.id)
      expect(response).to have_http_status :ok

      payload = parsed_body
      expect(payload).to have_key('id')
      expect(payload).to have_key('name')
      expect(payload['id']).to eq(foo.id)
      expect(payload['name']).to eq(foo.name)
    end

    it 'returns not found when using incorrect ID' do
      get foo_path(bad_id)
      expect(response).to have_http_status :not_found
      expect(response.content_type).to eq('application/json')

      payload = parsed_body
      expect(payload).to have_key('errors')
      expect(payload['errors']).to have_key('full_messages')
      expect(payload['errors']['full_messages'][0]).to include('cannot',
                                                               bad_id.to_s)
    end
  end

  context 'create a new Foo' do
    let(:foo_state) { FactoryGirl.attributes_for(:foo) }
    it 'can create with provided name' do
      jpost foos_path, foo_state
      expect(response).to have_http_status(:created)
      expect(response.content_type).to eq('application/json')
    end
  end

  context 'existing Foo' do
    it 'can update name'
    it 'can be deleted'
  end
end
