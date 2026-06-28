class RenameUnsubscribeTokenToAccountToken < ActiveRecord::Migration[8.0]
  def change
    rename_column :users, :unsubscribe_token, :account_token

    # Backfill: any user without a token gets one. Defensive — original migration
    # already backfilled, but handle edge cases (manual nils, test fixtures).
    reversible do |dir|
      dir.up do
        User.reset_column_information
        User.where(account_token: nil).find_each do |user|
          user.update_columns(account_token: SecureRandom.urlsafe_base64(16))
        end
      end
    end
  end
end
