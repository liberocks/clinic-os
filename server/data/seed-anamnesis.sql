-- Inserting data into customer table
INSERT INTO customer (id, email, first_name, last_name, phone, has_account, password_hash) VALUES
('cust_001', 'john.doe@example.com', 'John', 'Doe', '+1234567890', true, 'c2NyeXB0AAEAAAABAAAAAZmsVD0ob95FfxtF2QSpKk9UbZRvMJC6L/u3Dw3yqeFT1c/vkx3vSWL31JizpxGl5b+y8nVRVcCEiImA8C3ZVprR+twm0ODT3PNkSzS2IdPQ'),
('cust_002', 'jane.smith@example.com', 'Jane', 'Smith', '+1987654321', true, 'c2NyeXB0AAEAAAABAAAAAZmsVD0ob95FfxtF2QSpKk9UbZRvMJC6L/u3Dw3yqeFT1c/vkx3vSWL31JizpxGl5b+y8nVRVcCEiImA8C3ZVprR+twm0ODT3PNkSzS2IdPQ'),
('cust_003', 'alice.johnson@example.com', 'Alice', 'Johnson', '+1122334455', true, 'c2NyeXB0AAEAAAABAAAAAZmsVD0ob95FfxtF2QSpKk9UbZRvMJC6L/u3Dw3yqeFT1c/vkx3vSWL31JizpxGl5b+y8nVRVcCEiImA8C3ZVprR+twm0ODT3PNkSzS2IdPQ'),
('cust_004', 'bob.williams@example.com', 'Bob', 'Williams', '+1567890123', false, NULL),
('cust_101', 'emma.wilson@example.com', 'Emma', 'Wilson', '+1555012345', true, 'c2NyeXB0AAEAAAABAAAAAZmsVD0ob95FfxtF2QSpKk9UbZRvMJC6L/u3Dw3yqeFT1c/vkx3vSWL31JizpxGl5b+y8nVRVcCEiImA8C3ZVprR+twm0ODT3PNkSzS2IdPQ'),
('cust_102', 'liam.chen@example.com', 'Liam', 'Chen', '+1555123456', true, 'c2NyeXB0AAEAAAABAAAAAZmsVD0ob95FfxtF2QSpKk9UbZRvMJC6L/u3Dw3yqeFT1c/vkx3vSWL31JizpxGl5b+y8nVRVcCEiImA8C3ZVprR+twm0ODT3PNkSzS2IdPQ'),
('cust_103', 'sophia.patel@example.com', 'Sophia', 'Patel', '+1555234567', true, 'c2NyeXB0AAEAAAABAAAAAZmsVD0ob95FfxtF2QSpKk9UbZRvMJC6L/u3Dw3yqeFT1c/vkx3vSWL31JizpxGl5b+y8nVRVcCEiImA8C3ZVprR+twm0ODT3PNkSzS2IdPQ'),
('cust_104', 'noah.garcia@example.com', 'Noah', 'Garcia', '+1555345678', false, NULL),
('cust_105', 'olivia.kim@example.com', 'Olivia', 'Kim', '+1555456789', true, 'c2NyeXB0AAEAAAABAAAAAZmsVD0ob95FfxtF2QSpKk9UbZRvMJC6L/u3Dw3yqeFT1c/vkx3vSWL31JizpxGl5b+y8nVRVcCEiImA8C3ZVprR+twm0ODT3PNkSzS2IdPQ');

-- Inserting data into anamnesis_form table
INSERT INTO anamnesis_form (id, title, description) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'General Health Assessment', 'A comprehensive health assessment form'),
('550e8400-e29b-41d4-a716-446655440001', 'Dental History', 'Dental health and history questionnaire'),
('550e8400-e29b-41d4-a716-446655440002', 'Mental Health Screening', 'Initial mental health assessment'),
('550e8400-e29b-41d4-a716-446655440003', 'Physical Fitness Evaluation', 'Fitness level and exercise habits assessment'),
('f7e0fcf3-5a1d-4b6a-b61a-b3c6f3a573a1', 'Cardiovascular Health Assessment', 'Comprehensive heart health evaluation'),
('a2b4c6d8-e0f2-4a6c-8e0a-2c4e6f8a0b2d', 'Nutritional Habits Survey', 'Dietary patterns and nutritional intake assessment'),
('b3d5e7f9-1a3c-5e7g-9i1k-3m5o7p9r1t3v', 'Sleep Quality Evaluation', 'Assessment of sleep patterns and quality'),
('c4f6h8j0-2b4d-6f8h-0j2l-4n6p8r0t2v4x', 'Stress Management Questionnaire', 'Evaluation of stress levels and coping mechanisms'),
('d5g7i9k1-3c5e-7g9i-1k3m-5o7q9s1u3w5y', 'Family Medical History', 'Detailed family health background survey');

-- Inserting data into anamnesis_section table
INSERT INTO anamnesis_section (id, form_id, title, description, "order") VALUES
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Personal Information', 'Basic personal details', 1),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Medical History', 'Past and current medical conditions', 2),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Dental Concerns', 'Current dental issues and concerns', 1),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'Oral Hygiene Habits', 'Daily dental care routine', 2),
('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', 'Mood Assessment', 'Current emotional state', 1),
('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Exercise Routine', 'Regular physical activities', 1),
('s1e3g5i7-k9m1-o3q5-s7u9-w1y3a5c7e9g1', 'f7e0fcf3-5a1d-4b6a-b61a-b3c6f3a573a1', 'Blood Pressure History', 'Past and current blood pressure readings', 1),
('t2f4h6j8-l0n2-p4r6-t8v0-x2z4b6d8f0h2', 'f7e0fcf3-5a1d-4b6a-b61a-b3c6f3a573a1', 'Cholesterol Levels', 'HDL, LDL, and total cholesterol information', 2),
('u3g5i7k9-m1o3-q5s7-u9w1-y3a5c7e9g1i3', 'a2b4c6d8-e0f2-4a6c-8e0a-2c4e6f8a0b2d', 'Daily Diet Overview', 'Typical daily food intake', 1),
('v4h6j8l0-n2p4-r6t8-v0x2-z4b6d8f0h2j4', 'a2b4c6d8-e0f2-4a6c-8e0a-2c4e6f8a0b2d', 'Supplement Usage', 'Vitamins and dietary supplements taken', 2),
('w5i7k9m1-o3q5-s7u9-w1y3-a5c7e9g1i3k5', 'b3d5e7f9-1a3c-5e7g-9i1k-3m5o7p9r1t3v', 'Sleep Duration', 'Average hours of sleep per night', 1),
('x6j8l0n2-p4r6-t8v0-x2z4-b6d8f0h2j4l6', 'b3d5e7f9-1a3c-5e7g-9i1k-3m5o7p9r1t3v', 'Sleep Disturbances', 'Frequency and type of sleep interruptions', 2),
('y7k9m1o3-q5s7-u9w1-y3a5-c7e9g1i3k5m7', 'c4f6h8j0-2b4d-6f8h-0j2l-4n6p8r0t2v4x', 'Stress Triggers', 'Common causes of stress', 1),
('z8l0n2p4-r6t8-v0x2-z4b6-d8f0h2j4l6n8', 'd5g7i9k1-3c5e-7g9i-1k3m-5o7q9s1u3w5y', 'Hereditary Conditions', 'Known genetic health issues in the family', 1);

-- Inserting data into anamnesis_question table
INSERT INTO anamnesis_question (id, section_id, question_text, "order", question_type, options) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 'What is your date of birth?', 1, 'short_answer', NULL),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440005', 'Do you have any allergies?', 1, 'multiple_choice', '[{"label": "Yes", "value": "yes"}, {"label": "No", "value": "no"}]'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440006', 'When was your last dental check-up?', 1, 'short_answer', NULL),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440007', 'How often do you floss?', 1, 'multiple_choice', '[{"label": "Daily", "value": "daily"}, {"label": "Weekly", "value": "weekly"}, {"label": "Rarely", "value": "rarely"}, {"label": "Never", "value": "never"}]'),
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440008', 'How would you rate your overall mood today?', 1, 'multiple_choice', '[{"label": "Excellent", "value": "5"}, {"label": "Good", "value": "4"}, {"label": "Average", "value": "3"}, {"label": "Poor", "value": "2"}, {"label": "Very Poor", "value": "1"}]'),
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440009', 'How many times per week do you exercise?', 1, 'short_answer', NULL),
('q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6', 's1e3g5i7-k9m1-o3q5-s7u9-w1y3a5c7e9g1', 'What was your last blood pressure reading?', 1, 'short_answer', NULL),
('i7u8o9p0-a1s2-d3f4-g5h6-j7k8l9m0n1b2', 't2f4h6j8-l0n2-p4r6-t8v0-x2z4b6d8f0h2', 'Have you ever had high cholesterol?', 1, 'multiple_choice', '[{"label": "Yes", "value": "yes"}, {"label": "No", "value": "no"}, {"label": "Unsure", "value": "unsure"}]'),
('v3c4b5n6-m7,8-k9j0-h1g2-f3d4s5a6p7o8', 'u3g5i7k9-m1o3-q5s7-u9w1-y3a5c7e9g1i3', 'How many servings of vegetables do you eat daily?', 1, 'short_answer', NULL),
('l9k8j7h6-g5f4-d3s2-a1p0-o9i8u7y6t5r4', 'v4h6j8l0-n2p4-r6t8-v0x2-z4b6d8f0h2j4', 'Do you take any vitamin supplements?', 1, 'multiple_choice', '[{"label": "Daily", "value": "daily"}, {"label": "Sometimes", "value": "sometimes"}, {"label": "Never", "value": "never"}]'),
('e3w2q1a2-s3d4-f5g6-h7j8-k9l0p1o2i3u4', 'w5i7k9m1-o3q5-s7u9-w1y3-a5c7e9g1i3k5', 'On average, how many hours do you sleep per night?', 1, 'short_answer', NULL),
('y5t6r7e8-w9q0-a1s2-d3f4-g5h6j7k8l9m0', 'x6j8l0n2-p4r6-t8v0-x2z4-b6d8f0h2j4l6', 'How often do you have trouble falling asleep?', 1, 'multiple_choice', '[{"label": "Never", "value": "never"}, {"label": "Rarely", "value": "rarely"}, {"label": "Sometimes", "value": "sometimes"}, {"label": "Often", "value": "often"}, {"label": "Always", "value": "always"}]'),
('n1b2v3c4-x5z6-l7k8-j9h0-g6f5d4s3a2p1', 'y7k9m1o3-q5s7-u9w1-y3a5-c7e9g1i3k5m7', 'What are your main sources of stress?', 1, 'short_answer', NULL),
('m0n9b8v7-c6x5-z4l3-k2j1-h0g9f8d7s6a5', 'z8l0n2p4-r6t8-v0x2-z4b6-d8f0h2j4l6n8', 'Is there a history of heart disease in your family?', 1, 'multiple_choice', '[{"label": "Yes", "value": "yes"}, {"label": "No", "value": "no"}, {"label": "Unsure", "value": "unsure"}]');

-- Inserting data into anamnesis_response table
INSERT INTO anamnesis_response (id, customer_id, form_id, responses) VALUES
('550e8400-e29b-41d4-a716-446655440016', 'cust_001', '550e8400-e29b-41d4-a716-446655440000', '[{"question_id": "550e8400-e29b-41d4-a716-446655440010", "answer": "1985-03-15"}, {"question_id": "550e8400-e29b-41d4-a716-446655440011", "answer": "no"}]'),
('550e8400-e29b-41d4-a716-446655440017', 'cust_002', '550e8400-e29b-41d4-a716-446655440001', '[{"question_id": "550e8400-e29b-41d4-a716-446655440012", "answer": "2023-01-15"}, {"question_id": "550e8400-e29b-41d4-a716-446655440013", "answer": "daily"}]'),
('550e8400-e29b-41d4-a716-446655440018', 'cust_003', '550e8400-e29b-41d4-a716-446655440002', '[{"question_id": "550e8400-e29b-41d4-a716-446655440014", "answer": "4"}]'),
('550e8400-e29b-41d4-a716-446655440019', 'cust_001', '550e8400-e29b-41d4-a716-446655440003', '[{"question_id": "550e8400-e29b-41d4-a716-446655440015", "answer": "3"}]'),
('r1e2s3p4-o5n6-s7e8-i9d0-a1b2c3d4e5f6', 'cust_101', 'f7e0fcf3-5a1d-4b6a-b61a-b3c6f3a573a1', '[{"question_id": "q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6", "answer": "120/80"}, {"question_id": "i7u8o9p0-a1s2-d3f4-g5h6-j7k8l9m0n1b2", "answer": "no"}]'),
('r7e8s9p0-o1n2-s3e4-i5d6-f7g8h9i0j1k2', 'cust_102', 'a2b4c6d8-e0f2-4a6c-8e0a-2c4e6f8a0b2d', '[{"question_id": "v3c4b5n6-m7,8-k9j0-h1g2-f3d4s5a6p7o8", "answer": "3"}, {"question_id": "l9k8j7h6-g5f4-d3s2-a1p0-o9i8u7y6t5r4", "answer": "daily"}]'),
('r3e4s5p6-o7n8-s9e0-i1d2-l3m4n5o6p7q8', 'cust_103', 'b3d5e7f9-1a3c-5e7g-9i1k-3m5o7p9r1t3v', '[{"question_id": "e3w2q1a2-s3d4-f5g6-h7j8-k9l0p1o2i3u4", "answer": "7"}, {"question_id": "y5t6r7e8-w9q0-a1s2-d3f4-g5h6j7k8l9m0", "answer": "sometimes"}]'),
('r9e0s1p2-o3n4-s5e6-i7d8-r9s0t1u2v3w4', 'cust_104', 'c4f6h8j0-2b4d-6f8h-0j2l-4n6p8r0t2v4x', '[{"question_id": "n1b2v3c4-x5z6-l7k8-j9h0-g6f5d4s3a2p1", "answer": "Work and financial issues"}]'),
('r5e6s7p8-o9n0-s1e2-i3d4-x5y6z7a8b9c0', 'cust_105', 'd5g7i9k1-3c5e-7g9i-1k3m-5o7q9s1u3w5y', '[{"question_id": "m0n9b8v7-c6x5-z4l3-k2j1-h0g9f8d7s6a5", "answer": "yes"}]');

-- Inserting data into anamnesis_assignment table
INSERT INTO anamnesis_assignment (id, user_id, form_id, status) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'cust_001', '550e8400-e29b-41d4-a716-446655440000', 'new'),
('550e8400-e29b-41d4-a716-446655440021', 'cust_002', '550e8400-e29b-41d4-a716-446655440001', 'done'),
('550e8400-e29b-41d4-a716-446655440022', 'cust_003', '550e8400-e29b-41d4-a716-446655440002', 'new'),
('550e8400-e29b-41d4-a716-446655440023', 'cust_001', '550e8400-e29b-41d4-a716-446655440003', 'done'),
('a1s2s3i4-g5n6-m7e8-n9t0-i1d2n3e4w5s6', 'cust_101', 'f7e0fcf3-5a1d-4b6a-b61a-b3c6f3a573a1', 'new'),
('a7s8s9i0-g1n2-m3e4-n5t6-i7d8n9e0w1s2', 'cust_102', 'a2b4c6d8-e0f2-4a6c-8e0a-2c4e6f8a0b2d', 'done'),
('a3s4s5i6-g7n8-m9e0-n1t2-i3d4n5e6w7s8', 'cust_103', 'b3d5e7f9-1a3c-5e7g-9i1k-3m5o7p9r1t3v', 'new'),
('a9s0s1i2-g3n4-m5e6-n7t8-i9d0n1e2w3s4', 'cust_104', 'c4f6h8j0-2b4d-6f8h-0j2l-4n6p8r0t2v4x', 'done'),
('a5s6s7i8-g9n0-m1e2-n3t4-i5d6n7e8w9s0', 'cust_105', 'd5g7i9k1-3c5e-7g9i-1k3m-5o7q9s1u3w5y', 'new'),
('b1s2s3i4-g5n6-m7e8-n9t0-j1d2n3e4w5s6', 'cust_101', 'a2b4c6d8-e0f2-4a6c-8e0a-2c4e6f8a0b2d', 'new'),
('b7s8s9i0-g1n2-m3e4-n5t6-j7d8n9e0w1s2', 'cust_102', 'b3d5e7f9-1a3c-5e7g-9i1k-3m5o7p9r1t3v', 'done'),
('b3s4s5i6-g7n8-m9e0-n1t2-j3d4n5e6w7s8', 'cust_103', 'c4f6h8j0-2b4d-6f8h-0j2l-4n6p8r0t2v4x', 'new');