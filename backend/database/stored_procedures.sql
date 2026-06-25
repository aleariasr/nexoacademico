DROP PROCEDURE IF EXISTS sp_get_user_dashboard;
DROP PROCEDURE IF EXISTS sp_get_user_task_summary;
DROP PROCEDURE IF EXISTS sp_soft_delete_task;

DELIMITER //

CREATE PROCEDURE sp_get_user_dashboard(IN p_user_id INT)
BEGIN
    SELECT
        (SELECT COUNT(*)
         FROM academic_course
         WHERE user_id = p_user_id
           AND status = 'active') AS active_courses,

        (SELECT COUNT(*)
         FROM academic_academictask
         WHERE user_id = p_user_id
           AND is_deleted = 0
           AND status = 'pending') AS pending_tasks,

        (SELECT COUNT(*)
         FROM academic_academictask
         WHERE user_id = p_user_id
           AND is_deleted = 0
           AND status = 'in_progress') AS in_progress_tasks,

        (SELECT COUNT(*)
         FROM academic_academictask
         WHERE user_id = p_user_id
           AND is_deleted = 0
           AND status = 'completed') AS completed_tasks,

        (SELECT COUNT(*)
         FROM academic_academictask
         WHERE user_id = p_user_id
           AND is_deleted = 0
           AND due_date < NOW()
           AND status <> 'completed') AS overdue_tasks;
END//

CREATE PROCEDURE sp_get_user_task_summary(IN p_user_id INT)
BEGIN
    SELECT
        status,
        priority,
        COUNT(*) AS total
    FROM academic_academictask
    WHERE user_id = p_user_id
      AND is_deleted = 0
    GROUP BY status, priority
    ORDER BY status, priority;
END//

CREATE PROCEDURE sp_soft_delete_task(
    IN p_task_id INT,
    IN p_user_id INT
)
BEGIN
    UPDATE academic_academictask
    SET
        is_deleted = 1,
        deleted_at = NOW(),
        updated_at = NOW()
    WHERE id = p_task_id
      AND user_id = p_user_id;
END//

DELIMITER ;