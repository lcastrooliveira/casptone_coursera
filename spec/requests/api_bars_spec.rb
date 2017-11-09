require 'rails_helper'

RSpec.describe 'ApiBars', type: :request do
  include_context 'db_cleanup_each'

  context 'caller requests list of Bars' do
    it_should_behave_like 'resource index', :bar do
      let(:response_check) do
        expect(payload.map { |f| f['name'] })
          .to eq(resources.map { |f| f[:name] })
      end
    end
  end

  context 'a specific Bar exists' do
    it_should_behave_like 'resource show', :bar do
      let(:response_check) do
        expect(payload).to have_key('id')
        expect(payload).to have_key('name')
        expect(payload['id']).to eq(resource.id.to_s)
        expect(payload['name']).to eq(resource.name)
      end
    end
  end

  context 'create a new Bar' do
    it_should_behave_like 'resource create', :bar
  end

  context 'existing Bar' do
    it_should_behave_like 'resource update', :bar do
      let(:update_check) do
        expect(Bar.find(resource.id).name).to eq(new_state[:name])
      end
    end

    it_should_behave_like 'resource delete', :bar
  end
end
