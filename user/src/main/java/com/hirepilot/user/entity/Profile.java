package com.hirepilot.user.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "full_name")
    private String fullName;

    private String headline;

    @Column(length = 2000)
    private String bio;

    @Column(name = "company_name")
    private String companyName;

    private String designation;

    private Integer experience;

    @Column(length = 1000)
    private String skills;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "location")
    private String location;

    @Column(name = "education")
    private String education;

    @Pattern(
            regexp = "^$|^[0-9]{10,15}$",
            message = "Phone number must contain only digits (10-15 digits)"
    )
    @Column(name = "phone_number",nullable = true)
    private String phoneNumber;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}