require 'rails_helper'

RSpec.describe 'Foo API', type: :request do
  include_context 'db_cleanup_each', :transaction

  context 'caller request a list of Foos' do
    it_should_behave_like 'resource index', :foo do
      let(:response_check) do
        expect(payload.map { |f| f['name'] })
          .to eq(resources.map { |f| f[:name] })
      end
    end
  end

  context 'a specific Foo exists' do
    it_should_behave_like 'resource show', :foo do
      let(:response_check) do
        expect(payload).to have_key('id')
        expect(payload).to have_key('name')
        expect(payload['id']).to eq(resource.id)
        expect(payload['name']).to eq(resource.name)
      end
    end
  end

  context 'create a new Foo' do
    it_should_behave_like 'resource create', :foo
  end

  context 'existing Foo' do
    it_should_behave_like 'resource update', :foo do
      let(:update_check) do
        expect(Foo.find(resource.id).name).to eq(new_state[:name])
      end
    end

    it_should_behave_like 'resource delete', :foo
  end
end
