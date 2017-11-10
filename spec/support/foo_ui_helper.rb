module FooUiHelper
  FOO_FORM_XPATH = "//h3[text()='Foos']/../form".freeze
  FOO_LIST_XPATH = "//h3[text()='Foos']/../ul".freeze

  def create_foo(foo_state)
    visit root_path unless page.has_css?('h3', text: 'Foos')
    expect(page).to have_css('h3', text: 'Foos')

    within(:xpath, FOO_FORM_XPATH) do
      fill_in('name', with: foo_state[:name])
      click_button('Create Foo')
    end

    within(:xpath, FOO_LIST_XPATH) do
      expect(page).to have_css('li a', text: foo_state[:name])
    end
  end

  def update_foo(existing_name, new_name)
    find('li a', text: existing_name).click
    within(:xpath, FOO_FORM_XPATH) do
      fill_in('name', with: new_name)
      click_button('Update Foo')
    end
  end

  def delete_foo(name)
    find('li a', text: name).click
    within(:xpath, FOO_FORM_XPATH) do
      fill_in('name', with: name)
      click_button('Delete Foo')
    end
  end
end
