module UiHelper
  def fillin_signup(registration)
    visit "#{ui_path}/#/signup" unless page.has_css?('#signup-form')
    expect(page).to have_css('#signup-form', wait: 5)

    fill_in('signup-email', with: registration[:email])
    fill_in('signup-name', with: registration[:name])
    fill_in('signup-password', with: registration[:password])
    fill_in('signup-password_confirmation',
            with: registration[:password_confirmation] ||
                  registration[:password])
  end

  def signup(registration, success = true)
    fillin_signup registration
    click_on('Sign Up')
    if success
      expect(page).to have_no_button('Sign Up', wait: 5)
    else
      expect(page).to have_button('Sign Up')
    end
  end

  def fillin_login(credentials)
    find('#navbar-loginlabel', text: 'Login').click
    within('#login-form') do
      fill_in('login_email', with: credentials[:email])
      fill_in('login_password', with: credentials[:password])
    end
  end

  def login(credentials, success = true)
    fillin_login credentials
    click_button('Login')
    using_wait_time 5 do
      expect(page).to have_no_css('#login-form')
    end
  end

  def logged_in?(account = nil)
    if account
      page.has_css?('#navbar-loginlabel', text: /#{account[:name]}/)
    else
      page.has_css?('#user_id', text: /.+/, visible: false)
    end
  end

  def logout
    return if page.has_css?('#navbar-loginlabel', text: 'Login')
    # logout
    find('#navbar-loginlabel').click
    find_button('Logout').click
    # dropdown goes away
    expect(page).to have_no_css('#login-form')
    expect(page).to have_no_css('#logout-form')
  end
end
