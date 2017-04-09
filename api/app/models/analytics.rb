class Analytics
  def initialize(start_date, end_date = Time.now)
    @start_date = start_date
    @end_date = end_date
  end

  def new_users
    User.select(user_fields)
        .where(created_at: @start_date..@end_date)
        .order(created_at: :desc)
  end

  def active_users
    User.joins(:sessions)
        .select(user_fields)
        .where(sessions: {
          last_seen: start_date..end_date
        })
        .distinct
        .order(created_at: :desc)
  end

  def new_vehicles
    Vehicle.unscoped
          .where(created_at: @start_date..@end_date)
          .order(created_at: :desc)
  end

  def new_reminders
    Reminder.unscoped
            .where(created_at: @start_date..@end_date)
            .order(created_at: :desc)
  end

  def new_records
    Record.unscoped
          .where(created_at: @start_date..@end_date)
          .order(created_at: :desc)
  end

  private
  def user_fields
    [:id, :email, :created_at, :updated_at]
  end
end
