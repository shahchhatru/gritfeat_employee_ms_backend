

export const messages = {
  organization: {
    createsuccess: 'Organization Created Successfully',
    create_failed: 'Failed to create organization',
    not_found: 'No organization found',
    get_all_success: 'Succesfully fetched all organizations',
    fetch_success: 'Successfully fetch organization',
    delete_success: 'Succesfully deleted organization',
    update_success: 'Updated successfully organization',
  },
  user: {
    creation_success: 'User Created Successfully',
    user_not_found: "User Not found",
    user_found_succes: "Succesfully fetched Users",
    user_already_verified: "The following account is an already verified account",
    invalid_password: "Password or the user is invalid ",
    user_update_succes: "User updated successfully",
  },
  otp: {
    creation_failed: "there was a problem creating otp",
    success: "OTP was successfully created",
    verification_success: "OTP was successfully verified",
    verification_failed: "OTP verification failed"
  },
  task: {
    creation_success: 'Task Created Successfully',
    all_get_success: 'Tasks Fetched Successfully',
    one_get_success: 'Task Fetched Successfully',
    not_found: 'Task With Given Id Not Found',
    edit_success: 'Task Edited Successfully',
    delete_success: 'Task Deleted Successfully',
    edit_forbidden: 'Forbidden To Edit Task',
    delete_forbidden: 'Forbidden To Delete Task',
    get_rule_success: 'Fetched Task Update Rule Successfully',
    author_userId_mismatch: "Trying to Task using someone else credentials",
    task_state_update_success: "Task state updated successfully",
    validation: {
      missing_author: 'Please provide author which exists in database in message body',
      missing_content: "Please fill out content in the Task",
      missing_title: "The Task must have a non empty title"
    },

  },
  auth: {
    login_success: 'LoggedIn Successfully',
    invalid_account: 'Invalid Password or Email',
    refresh_token_success: "refresh token successfully sent",
    auth_token_expired: "the access or refresh token has expired",
    invalid_user_id: "the user probably doesn't exits",
    userId_not_found: "the user id not found",
    password_reset_link_success: 'Password reset link sent successfully.',
    password_reset_success: 'Passwozd reset successfully. Please login with new password. The password reset successfully.',
    invalid_old_password: "Invalid old password. Please try again",
  },
  error: {
    internal_server_error: 'Internal Server Error',
  },
  email: {
    empty_email_address: "Email address cannot be empty",
    invalid_email_format: "Invalid email format. Email must contain '@' and '.'.",
    invalid_message: "Invalid email address"
  },
  password: {
    errorMessages: {
      minLength: "Password must be at least 8 characters long.",
      digitRequired: "Password must contain at least one digit.",
      uppercaseRequired: "Password must contain at least one uppercase letter.",
      specialCharRequired: "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>).",
      invalidPassword: "Invalid password."
    }
  },
  comments: {
    errorMessages: {
      not_found: "comment not found",
      edit_forbidden: "Forbidden To Edit Comment"
    },
    edit_success: "Your comment was edited successfully",
    creation_success: "Your comment was successfully Tasked",
    deletion_success: "Your comment was successfully deleted",
    get_all_success: "Comments have been successfully fetched",
  },
  actions: {
    forbidden_message: "You don't have permission to perform this action"
  },
  profile: {
    creation_success: 'Profile Created Successfully',
    all_get_success: 'Profiles Fetched Successfully',
    one_get_success: 'Profile Fetched Successfully',
    not_found: 'Profile With Given Id Not Found',
    edit_success: 'Profile Edited Successfully',
    delete_success: 'Profile Deleted Successfully',
    edit_forbidden: 'Forbidden To Edit Profile',
    delete_forbidden: 'Forbidden To Delete Profile',
    get_rule_success: 'Fetched Profile Update Rule Successfully',
    author_userId_mismatch: "Trying to Profile using someone else credentials",
    task_state_update_success: "Profile state updated successfully",
    validation: {
      missing_author: 'Please provide author which exists in database in message body',
      missing_content: "Please fill out content in the Profile",
      missing_title: "The Profile must have a non empty title"
    },
    creation_failed: 'Failed to create Profile'
  }
  ,
  employee: {
    creation_success: 'Employee Created Successfully',
    creation_failed: 'Failed to create Employee',
    all_get_success: 'Employees Fetched Successfully',
    one_get_success: 'Employee Fetched Successfully',
    not_found: 'Employee With Given Id Not Found',
    edit_success: 'Employee Edited Successfully',
    delete_success: 'Employee Deleted Successfully',
    edit_forbidden: 'Forbidden To Edit Employee',
    delete_forbidden: 'Forbidden To Delete Employee',
    get_rule_success: 'Fetched Employee Update Rule Successfully',
    author_userId_mismatch: "Trying to Employee using someone else credentials",
    task_state_update_success: "Employee state updated successfully",
  },

  application: {
    creation_success: 'Application Created Successfully',
    creation_failed: 'Failed to create Application',
    all_get_success: 'Applications Fetched Successfully',
    one_get_success: 'Application Fetched Successfully',
    not_found: 'Application With Given Id Not Found',
    edit_success: 'Application Edited Successfully',
    delete_success: 'Application Deleted Successfully',
    edit_forbidden: 'Forbidden To Edit Application',
    delete_forbidden: 'Forbidden To Delete Application',
    get_rule_success: 'Fetched Application Update Rule Successfully',
    author_userId_mismatch: "Trying to Application using someone else credentials",
    application_state_update_success: "Application state updated successfully",
  },
  salary: {
    creation_success: 'Salary Reciept Storedd Successfully in database',
    creation_failed: 'Failed to create Salary Reciept',
  }

};
