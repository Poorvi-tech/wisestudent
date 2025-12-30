// Script to link a student account to a parent account for testing
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import SchoolStudent from './models/School/SchoolStudent.js';

// Load environment variables
dotenv.config();

const linkStudentToParent = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/finmen';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const studentEmail = 'studentkvp@gmail.com';
    const parentEmail = 'testparent@finmen.com';

    console.log(`\n🔍 Looking for student: ${studentEmail}`);
    console.log(`🔍 Looking for parent: ${parentEmail}`);

    // Find student
    const student = await User.findOne({ 
      email: studentEmail.toLowerCase(),
      role: { $in: ['school_student', 'student'] }
    });

    if (!student) {
      console.error(`❌ Student not found with email: ${studentEmail}`);
      console.log('Available students with similar emails:');
      const similarStudents = await User.find({ 
        email: { $regex: 'student', $options: 'i' },
        role: { $in: ['school_student', 'student'] }
      }).select('email name role').limit(5);
      similarStudents.forEach(s => console.log(`  - ${s.email} (${s.name}, ${s.role})`));
      process.exit(1);
    }

    console.log(`✅ Found student: ${student.name || student.email} (ID: ${student._id})`);

    // Find parent
    const parent = await User.findOne({ 
      email: parentEmail.toLowerCase(),
      role: { $in: ['school_parent', 'parent'] }
    });

    if (!parent) {
      console.error(`❌ Parent not found with email: ${parentEmail}`);
      console.log('Available parents with similar emails:');
      const similarParents = await User.find({ 
        email: { $regex: 'parent', $options: 'i' },
        role: { $in: ['school_parent', 'parent'] }
      }).select('email name role').limit(5);
      similarParents.forEach(p => console.log(`  - ${p.email} (${p.name}, ${p.role})`));
      process.exit(1);
    }

    console.log(`✅ Found parent: ${parent.name || parent.email} (ID: ${parent._id})`);

    // Check if already linked
    const isAlreadyLinked = 
      (parent.linkedIds?.childIds?.some(id => id.toString() === student._id.toString())) ||
      (student.linkedIds?.parentIds?.some(id => id.toString() === parent._id.toString()));

    if (isAlreadyLinked) {
      console.log('⚠️  Student and parent are already linked in User records!');
      console.log('\n📋 Current Link Status:');
      console.log(`  Parent's childIds: ${parent.linkedIds?.childIds?.length || 0} children`);
      console.log(`  Student's parentIds: ${student.linkedIds?.parentIds?.length || 0} parents`);
      console.log('\n🔍 Checking SchoolStudent record...');
    } else {
      console.log('\n🔗 Linking student to parent...');
    }

    // Initialize linkedIds if they don't exist
    if (!parent.linkedIds) parent.linkedIds = {};
    if (!parent.linkedIds.childIds) parent.linkedIds.childIds = [];
    if (!student.linkedIds) student.linkedIds = {};
    if (!student.linkedIds.parentIds) student.linkedIds.parentIds = [];

    if (!isAlreadyLinked) {
      // Add student to parent's childIds
      if (!parent.linkedIds.childIds.some(id => id.toString() === student._id.toString())) {
        parent.linkedIds.childIds.push(student._id);
        console.log('  ✅ Added student to parent\'s childIds');
      }

      // Add student email to parent's childEmail array
      if (!parent.childEmail) parent.childEmail = [];
      if (!parent.childEmail.includes(student.email)) {
        parent.childEmail.push(student.email);
        console.log('  ✅ Added student email to parent\'s childEmail');
      }

      // Add parent to student's parentIds
      if (!student.linkedIds.parentIds.some(id => id.toString() === parent._id.toString())) {
        student.linkedIds.parentIds.push(parent._id);
        console.log('  ✅ Added parent to student\'s parentIds');
      }

      // Set guardian email on student
      student.guardianEmail = parent.email;
      console.log('  ✅ Set guardian email on student');

      // Save parent and student
      await parent.save();
      await student.save();
      console.log('  ✅ Saved parent and student records');
    }

    // Update SchoolStudent collection if student has a SchoolStudent record
    // Note: SchoolStudent requires tenantId for queries
    if (student.tenantId) {
      const schoolStudent = await SchoolStudent.findOne({ 
        userId: student._id,
        tenantId: student.tenantId 
      });
      if (schoolStudent) {
        if (!schoolStudent.parentIds) schoolStudent.parentIds = [];
        if (!schoolStudent.parentIds.some(id => id.toString() === parent._id.toString())) {
          schoolStudent.parentIds.push(parent._id);
          await schoolStudent.save();
          console.log('  ✅ Updated SchoolStudent record');
        } else {
          console.log('  ℹ️  SchoolStudent record already has this parent');
        }
      } else {
        console.log('  ℹ️  No SchoolStudent record found (this is okay for non-school students)');
      }
    } else {
      console.log('  ℹ️  Student has no tenantId, skipping SchoolStudent update (this is okay for non-school students)');
    }

    console.log('\n📋 Link Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Student: ${student.name || student.email}`);
    console.log(`  Email: ${student.email}`);
    console.log(`  ID: ${student._id}`);
    console.log(`  Guardian Email: ${student.guardianEmail}`);
    console.log(`  Parent IDs: ${student.linkedIds.parentIds.length}`);
    console.log('\nParent:');
    console.log(`  Name: ${parent.name || parent.email}`);
    console.log(`  Email: ${parent.email}`);
    console.log(`  ID: ${parent._id}`);
    console.log(`  Child IDs: ${parent.linkedIds.childIds.length}`);
    console.log(`  Child Emails: ${parent.childEmail.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🎉 Student and parent linked successfully!');

  } catch (error) {
    console.error('❌ Error linking student to parent:', error);
    if (error.message) {
      console.error('Error message:', error.message);
    }
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

// Run the script
linkStudentToParent();

